import type { COMPONENTS_WITH_ICONS, FIXED_ELEMENT_TYPES, FIXED_ENTITY_METHOD_HOOKS, FIXED_ITEM_METHOD_HOOKS, FIXED_TILE_METHOD_HOOKS, NUMBER_TYPE_CONFIGS } from "./_constant_data";

type JSONModule = Record<string, any>;

export type ComponentWithIcon = typeof COMPONENTS_WITH_ICONS[number];

export type ElementType = typeof FIXED_ELEMENT_TYPES[number];
export type MethodHookType = typeof FIXED_ENTITY_METHOD_HOOKS[number] | typeof FIXED_ITEM_METHOD_HOOKS[number] | typeof FIXED_TILE_METHOD_HOOKS[number];
export type NumberType = keyof typeof NUMBER_TYPE_CONFIGS;

export type Field = {
  name: string;
  type: NumberType;
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

export type PotentialElement = {
  id: string;
  name: string;
  type: string;
}

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
  loadedElements: Element[];
  potentialElements: PotentialElement[];
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

export type ProjectProperty = 'name' | 'id' | 'author' | 'iconurl';

export interface EditorTab {
  id: string;
  type: TabType;
  name: string;
  icon: string;
  closable: boolean;
  elementId?: string;
}

export type TabType = 'browser' | 'element' | 'asset' | 'method';

export const modules: Record<string, JSONModule> = import.meta.glob('./schemas/**/*.json', {
  eager: true,
  import: 'default'
});

/**
 * Loads a JSON definition for a given element type and definition name.
 * This function accesses the pre-loaded `modules` object directly.
 * @param type - The base element type (e.g., 'entity', 'item').
 * @param name - The definition name (e.g., 'base', 'tool', 'hooks').
 * @returns The parsed JSON content, or null if not found.
 */
export function getDefinition(type: string, name: string): unknown | null {
  const path = `./schemas/${type}/${name}.json`;
  if (modules[path]) {
    return modules[path];
  }
  console.warn(`Definition not found: ${path}`);
  return null;
}

/**
 * Gets all available components for a given base element type.
 * @param type - The base element type (e.g., 'item').
 * @returns An array of component names (e.g., ['tool', 'weapon']).
 */
export function getComponentsForType(type: string): string[] {
  const components: string[] = [];
  for (const path in modules) {
    if (path.startsWith(`./schemas/${type}/`) && path.endsWith('.json')) {
      const fileName = path.split('/').pop();
      if (fileName) {
        const componentName = fileName.replace('.json', '');
        if (!['base', 'hooks', 'types'].includes(componentName)) {
          components.push(componentName);
        }
      }
    }
  }
  return components;
}

/**
 * Returns the number of fields on a given component.
 * @param type - The base element type (e.g., 'item').
 * @param componentName - The name of the component (e.g., 'weapon').
 * @returns The number of fields, or 0 if the component or its 'fields' property is not found.
 */
export function getNumberOfFieldsOnComponent(type: string, componentName: string): number {
  const componentDefinition = getDefinition(type, componentName);

    if (componentDefinition && typeof componentDefinition === 'object' && 'fields' in componentDefinition) {
        const fields = (componentDefinition as Record<string, any>).fields;
        if (Array.isArray(fields)) {
            return fields.length;
        }
    }
    return 0;
}

export const globalTypesDefinition: unknown = modules['./schemas/types.json'] || {};