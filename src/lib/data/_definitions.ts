import type { BaseOrComponentDefinition, Component, Schema } from "$lib/stores/engineStore";

type JSONModule = Record<string, any>;

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