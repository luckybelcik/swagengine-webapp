import { writable, get, derived } from 'svelte/store';
import { CURRENT_PROJECT_ID_KEY, DEFAULT_ICON_URL, ENGINE_VERSION, WEBAPP_VERSION } from '$lib/data/_constant_data';
import { getProject, saveProject, type Project } from '$lib/db';
import type { Element, EngineStore, Field, Schema } from '$lib/data/_definitions';

const initialEngineStore: EngineStore = {
  elements: [
    {
      id: 'item_sword',
      type: 'item',
      name: 'Iron Sword',
      data: { components: ["sword_component"] },
      methods: [{ type: 'OnUse', code: '// Called when the item is used' }],
      createdAt: new Date().toISOString(),
    },

    {
      id: 'basic_dude',
      type: 'entity',
      name: 'Basic Dude',
      data: { components: ["gravity_component", "hitbox_component"] },
      methods: [{ type: 'OnSpawn', code: '// Called when the dude is spawned' }],
      createdAt: new Date().toISOString(),
    },

    {
      id: 'money_block',
      type: 'tile',
      name: 'Money Block',
      data: { components: [] },
      methods: [{ type: 'OnPlace', code: '// Called when the block is placed' }],
      createdAt: new Date().toISOString(),
    },

    {
      id: 'set_money',
      type: 'command',
      name: 'Set Money',
      data: { components: [] },
      methods: [],
      createdAt: new Date().toISOString(),
    },

    {
      id: 'evil_bird_dude',
      type: 'boss',
      name: 'Evil Bird Dude',
      data: { components: [] },
      methods: [],
      createdAt: new Date().toISOString(),
    }
  ],
  projectData: {
    name: 'New Project',
    id: 'new_project',
    description: 'this is the default project description',
    author: 'Author',
    iconurl: DEFAULT_ICON_URL,
    projectVersion: '0.0.0',
    engineVersion: ENGINE_VERSION,
    webAppVersion: WEBAPP_VERSION
  }
};

async function getInitialProjectState(): Promise<EngineStore> {
  if (typeof window === 'undefined') {
    return initialEngineStore;
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

  const defaultProjectId = initialEngineStore.projectData.id;
  const defaultProject: Project = {
    id: defaultProjectId,
    projectData: initialEngineStore.projectData,
    elements: initialEngineStore.elements,
  };
  await saveProject(defaultProject);
  localStorage.setItem(CURRENT_PROJECT_ID_KEY, defaultProjectId);
  console.log("Initialized with default project and saved to IndexedDB.");
  return initialEngineStore;
}

export const engineStore = writable<EngineStore>(initialEngineStore);

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

export const setProjectName = (name: string) => {
  engineStore.update(state => ({
    ...state,
    projectData: { ...state.projectData, name }
  }));
};

export const setProjectID = (id: string) => {
  engineStore.update(state => ({
    ...state,
    projectData: { ...state.projectData, id }
  }));
};

export const setProjectDescription = (description: string) => {
  engineStore.update(state => ({
    ...state,
    projectData: { ...state.projectData, description }
  }));
};

export const setProjectAuthor = (author: string) => {
  engineStore.update(state => ({
    ...state,
    projectData: { ...state.projectData, author }
  }));
};

export const setProjectVersion = (version: string) => {
  engineStore.update(state => ({
    ...state,
    projectData: { ...state.projectData, projectVersion: version }
  }));
};

export const setEngineVersion = (version: string) => {
  engineStore.update(state => ({
    ...state,
    projectData: { ...state.projectData, engineVersion: version }
  }));
};

export const setIconUrl = (url: string) => {
  engineStore.update(state => ({
    ...state,
    projectData: { ...state.projectData, iconurl: url }
  }));
};

export const resetIcon = () => {
  engineStore.update(state => ({
    ...state,
    projectData: { ...state.projectData, iconurl: DEFAULT_ICON_URL }
  }));
};

export const getProjectVersion = (): string => {
  return get(engineStore).projectData.projectVersion;
}

export const getProjectName = (): string => {
  return get(engineStore).projectData.name;
}

export const getProjectID = (): string => {
  return get(engineStore).projectData.id;
}

export const getProjectAuthor = (): string => {
  return get(engineStore).projectData.author;
}

export const getProjectDescription = (): string => {
  return get(engineStore).projectData.description;
}

export const getProjectIconUrl = (): string => {
  return get(engineStore).projectData.iconurl;
}

export const getEngineVersion = (): string => {
  return get(engineStore).projectData.engineVersion;
}

export const getWebAppVersion = (): string => {
  return get(engineStore).projectData.webAppVersion;
}

export const getElementCount = (): number => {
  return get(engineStore).elements.length;
}

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
        setIconUrl(img.src);
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

      setIconUrl(processedDataUrl);
    };

    img.onerror = () => {
      console.error("Error loading image for processing.");
      setIconUrl(e.target?.result as string);
    };
  };

    reader.readAsDataURL(file);
  } else {
    resetIcon();
  }
}