import { writable, get } from 'svelte/store';
import { loadSchema } from "../../routes/editor/utils/schemaLoader";
import { components } from 'daisyui/imports';

export const FIXED_ELEMENT_TYPES = ['item', 'entity', 'tile', 'command', 'boss'] as const;
export const FIXED_ENTITY_METHOD_HOOKS = ['OnSpawn', 'OnDeath', 'OnHit', 'OnTick'] as const;
export const FIXED_ITEM_METHOD_HOOKS = ['OnUse', 'OnEquip', 'OnUnequip', 'OnPickup'] as const;

export type ElementType = typeof FIXED_ELEMENT_TYPES[number];
export type MethodHookType = typeof FIXED_ENTITY_METHOD_HOOKS[number] | typeof FIXED_ITEM_METHOD_HOOKS[number];

// --- TYPES ---

export type FieldDefinition = {
  name: string;
  type: string;
};

export type EnumDefinition = {
  type: "enum";
  values: string[];
};

export type Schema = {
  type: string;
  fields: FieldDefinition[];
  types?: Record<string, EnumDefinition>;
  hooks?: Record<string, HookDefinition>;
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
  fields?: FieldDefinition[];
}

export interface HooksDefinition {
  hooks: Record<string, HookDefinition>;
}

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
      id: 'super_item',
      type: 'item',
      name: 'Super Item',
      data: { components: ["debug"] },
      methods: [{ type: 'OnUse', code: '// Called when the item is used' }],
      createdAt: new Date().toISOString(),
    }
  ],
  projectData: {
    name: 'New Project',
    id: 'new_project',
    description: 'this is the default project description',
    author: 'Author',
    projectVersion: '0.0.0',
    engineVersion: '0.0.1',
    webAppVersion: '0.0.2'
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

export const getEngineVersion = (): string => {
  return get(engineStore).projectData.engineVersion;
}

export const getWebAppVersion = (): string => {
  return get(engineStore).projectData.webAppVersion;
}

export const getElementCount = (): number => {
  return get(engineStore).elements.length;
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
    elements: currentData.elements.map(element =>
      element.id === id ? { ...element, ...updates } : element
    )
  }));
};
