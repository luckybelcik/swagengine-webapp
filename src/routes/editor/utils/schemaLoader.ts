import { getComponentsForType, getDefinition, globalTypesDefinition } from '$lib/data/_definitions';
import type {
  Field,
  HookDefinition,
  Schema,
  BaseOrComponentDefinition,
  HooksDefinition,
  Component
} from '../../../lib/data/_definitions';
import { debugLog } from './util';

export function loadSchema(elementType: string): Schema {
  const components = getComponentsForType(elementType)
  const baseDef = getDefinition(elementType, 'base') as BaseOrComponentDefinition | null;
  let fields: Field[] = [...(baseDef?.fields || [])];
  let componentList: Component[] = [];

  componentList.push({
        name: "base",
        fields
      });

  for (const component of components) {
    const componentDef = getDefinition(elementType, component) as BaseOrComponentDefinition | null;
    if (componentDef?.fields) {
      fields = componentDef.fields;
      
      componentList.push({
        name: component,
        fields
      });
    }
  }

  const hooks: Record<string, HookDefinition> = { base: {} };
  const hooksDef = getDefinition(elementType, 'hooks') as HooksDefinition | null;

  if (hooksDef?.hooks) {
    hooks.base = hooksDef.hooks.base || {};
    for (const component of components) {
      if (hooksDef.hooks[component]) {
        hooks[component] = hooksDef.hooks[component];
      }
    }
  } else {
    console.warn(`[redbud] (schemaLoader) No hooks.json found for ${elementType}`);
  }

  const types = globalTypesDefinition as Record<string, any>;

  const schema: Schema = { type: elementType, components: componentList, availableHooks: hooks, types };
  debugLog("schemaLoader", "Loaded schema", hooks)
  return schema;
}
