import { writable, get, derived } from 'svelte/store';
import { CURRENT_PROJECT_ID_KEY, DEFAULT_ICON_URL, INITIAL_ENGINE_STORE } from '$lib/data/_constant_data';
import { getProject, saveProject, type Project } from '$lib/db';
import type { Element, EngineStore, Field, Schema } from '$lib/data/_definitions';

async function getInitialProjectState(): Promise<EngineStore> {
  if (typeof window === 'undefined') {
    return INITIAL_ENGINE_STORE;
  }

  const savedProjectId = localStorage.getItem(CURRENT_PROJECT_ID_KEY);

  if (savedProjectId) {
    try {
      const project = await getProject(savedProjectId);
      if (project) {
        console.log(`Loaded project '${project.projectData.name}' from IndexedDB`);
        return {
          elements: project.elements,
          projectData: project.projectData,
        };
      }
    } catch (e) {
      console.error(`Error loading project '${savedProjectId}' from IndexedDB:`, e);
    }
  }

  const defaultProjectId = INITIAL_ENGINE_STORE.projectData.id;
  const defaultProject: Project = {
    id: defaultProjectId,
    projectData: INITIAL_ENGINE_STORE.projectData,
    elements: INITIAL_ENGINE_STORE.elements,
  };
  await saveProject(defaultProject);
  localStorage.setItem(CURRENT_PROJECT_ID_KEY, defaultProjectId);
  console.log("Initialized with default project and saved to IndexedDB.");
  return INITIAL_ENGINE_STORE;
}

export const engineStore = writable<EngineStore>(INITIAL_ENGINE_STORE);

async function initializeEngineStoreFromDB() {
  const loadedState = await getInitialProjectState();
  engineStore.set(loadedState);
}

initializeEngineStoreFromDB();

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedSaveProject = debounce(async (project: Project) => {
  try {
    await saveProject(project);
    console.log(`Autosaved project '${project.projectData.name}' (${project.id}) to IndexedDB.`);
  } catch (e) {
    console.error("Error autosaving project to IndexedDB:", e);
  }
}, 2000);

const currentProjectState = derived(engineStore, ($engineStore) => {
  return {
    id: $engineStore.projectData.id,
    projectData: $engineStore.projectData,
    elements: $engineStore.elements,
  } as Project;
});

currentProjectState.subscribe((project) => {
  if (project.id) {
    debouncedSaveProject(project);
  }
});

type ProjectProperty = 'name' | 'id' | 'author' | 'iconurl';

export const setProjectProperty = (property: ProjectProperty, value: any) => {
  engineStore.update(state => ({
    ...state,
    projectData: { ...state.projectData, [property]: value }
  }));
}

export const resetIcon = () => {
  engineStore.update(state => ({
    ...state,
    projectData: { ...state.projectData, iconurl: DEFAULT_ICON_URL }
  }));
};

export const getElementName = (id: string) => {
  const elements = get(engineStore).elements;
  const element = elements.find(el => el.id === id);
  if (element) {
    return element.name;
  }

  return "idk"
}

export const addElement = (newElement: Element) => {
  engineStore.update(currentData => ({
    ...currentData,
    elements: [...currentData.elements, newElement]
  }));
};

export const elementIdExists = (id: string): boolean => {
  return get(engineStore).elements.some(element => element.id === id);
};

export const createNewElement = (name: string, id: string, type: string, components?: string[]): Element => {
  if (elementIdExists(id)) {
    throw new Error(`Element with ID '${id}' already exists.`);
  }

  const newElement: Element = {
    id,
    type,
    name,
    data: { components },
    methods: [],
    createdAt: new Date().toISOString()
  };

  addElement(newElement);
  return newElement;
};

export const deleteElement = (id: string) => {
  engineStore.update(currentData => ({
    ...currentData,
    elements: currentData.elements.filter(element => element.id !== id)
  }));
};

export const updateElement = (id: string, updates: Partial<Element>) => {
  engineStore.update(currentData => ({
    ...currentData,
    elements: currentData.elements.map(element => {
      if (element.id === id) {
        const updatedElement = { ...element, ...updates };
        if (updates.data) {
          updatedElement.data = {
            ...element.data,
            ...updates.data
          };
        }
        return updatedElement;
      }
      return element;
    })
  }));
};

export const getAllFields = (schema: Schema): Field[] => {
  let fields: Field[] = [];

  schema.components.forEach(component => {
    component.fields.forEach(field => {
      fields.push(field);
    });
  });

  return fields;
}

export const addComponent = (elementId: string, component_name: string) => {
  engineStore.update(store => {
    const elementToUpdate = store.elements.find(el => el.id === elementId);

    if (elementToUpdate) {
      const newComponents = [...(elementToUpdate.data.components || []), component_name];

      return {
        ...store,
        elements: store.elements.map(el => el.id === elementId ? { ...el, data: { ...el.data, components: newComponents, }, }
            : el
        ),
      };
    }
    return store;
  });
};

export const removeComponent = (elementId: string, component_name: string) => {
  engineStore.update(store => {
    const elementToUpdate = store.elements.find(el => el.id === elementId);

    if (elementToUpdate) {
      const currentComponents = elementToUpdate.data.components || [];
      const indexToDelete = currentComponents.indexOf(component_name);

      if (indexToDelete !== -1) {
        const newComponents = [...currentComponents];

        if (indexToDelete !== newComponents.length - 1) {
            newComponents[indexToDelete] = newComponents[newComponents.length - 1];
        }
        newComponents.pop();

        return {
          ...store,
          elements: store.elements.map(el => el.id === elementId ? { ...el, data: { ...el.data, components: newComponents, }, }: el ),
        };
      }
    }
    return store;
  });
};

export const hasComponent = (elementId: string, component_name: string): boolean => {
  const store = get(engineStore);
  const element = store.elements.find(el => el.id === elementId);
  const components = element?.data.components;
  if (components && components.length > 0) {
    const index = components.indexOf(component_name);
    if (index == -1) {
      return false;
    }
  } else {
    return false;
  }

  return true;
}

export const handleIconChange = (event: Event, fileInput: HTMLInputElement | undefined): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      resetIcon();
      if (fileInput) fileInput.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
    const img = new Image();
    img.src = e.target?.result as string;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Could not get 2D context for canvas.');
        setProjectProperty('iconurl', img.src);
        return;
      }

      const MAX_SIZE = 512;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
      }

      const size = Math.min(width, height);
      canvas.width = MAX_SIZE;
      canvas.height = MAX_SIZE;

      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      const sWidth = size;
      const sHeight = size;

      const dx = (MAX_SIZE - width) / 2;
      const dy = (MAX_SIZE - height) / 2;
      const dWidth = width;
      const dHeight = height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, MAX_SIZE, MAX_SIZE);

      const processedDataUrl = canvas.toDataURL('image/png', 0.9);

      setProjectProperty('iconurl', processedDataUrl);
    };

    img.onerror = () => {
      console.error("Error loading image for processing.");
      setProjectProperty('iconurl', e.target?.result as string);
    };
  };

    reader.readAsDataURL(file);
  } else {
    resetIcon();
  }
}