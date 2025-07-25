import { writable, get } from 'svelte/store';
import { loadSchema } from "../../routes/editor/utils/schemaLoader";
import { components } from 'daisyui/imports';

export const FIXED_ELEMENT_TYPES = ['item', 'entity', 'tile', 'command', 'boss'] as const;
export const FIXED_ENTITY_METHOD_HOOKS = ['OnSpawn', 'OnDeath', 'OnHit', 'OnTick'] as const;
export const FIXED_ITEM_METHOD_HOOKS = ['OnUse', 'OnEquip', 'OnUnequip', 'OnPickup'] as const;
export const FIXED_TILE_METHOD_HOOKS = ['OnPlace', 'OnBreak', 'OnStep'] as const;

export type ElementType = typeof FIXED_ELEMENT_TYPES[number];
export type MethodHookType = typeof FIXED_ENTITY_METHOD_HOOKS[number] |
  typeof FIXED_ITEM_METHOD_HOOKS[number] |
  typeof FIXED_TILE_METHOD_HOOKS[number];

// --- TYPES ---

export type Field = {
  name: string;
  type: string;
};

export type Enum = {
  type: "enum";
  values: string[];
};

export type Component = {
  name: string;
  fields: Field[]
}

export type Schema = {
  type: string;
  components: Component[];
  types?: Record<string, Enum>;
  availableHooks?: Record<string, HookDefinition>;
};

export type ElementData = {
  id: string;
  type: string;
  name?: string;
  [key: string]: any;
};


export interface Method {
  type: MethodHookType;
  code: string;
}

export interface Element {
  id: string;
  type: ElementType | string;
  name: string;
  data: Record<string, any>;
  methods: Method[];
  createdAt: string;
}

export interface EngineProjectData {
  name: string;
  id: string;
  description: string;
  author: string;
  iconurl: string;
  projectVersion: string;
  engineVersion: string;
  webAppVersion: string;
}

export interface EngineStore {
  elements: Element[];
  projectData: EngineProjectData;
}

export interface HookDefinition {
  [hookName: string]: any;
}

export interface BaseOrComponentDefinition {
  fields?: Field[];
}

export interface HooksDefinition {
  hooks: Record<string, HookDefinition>;
}

export const defaultIconUrl = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.publicdomainpictures.net%2Fpictures%2F30000%2Ft2%2Fred-apple-isolated.jpg&f=1&nofb=1&ipt=ccc6435a12be9f52147d442ddea931d20151cefa218c433212179795a09f55d3';

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
    iconurl: defaultIconUrl,
    projectVersion: '0.0.0',
    engineVersion: '0.0.1',
    webAppVersion: '0.0.6'
  }
};

export const engineStore = writable<EngineStore>(initialEngineStore);

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
    projectData: { ...state.projectData, iconurl: defaultIconUrl }
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