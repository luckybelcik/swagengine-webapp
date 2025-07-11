import { getAvailableComponentsForType, getDefinition, globalTypesDefinition } from '$lib/data/_definitions';
import type {
  FieldDefinition,
  HookDefinition,
  Schema,
  BaseOrComponentDefinition,
  HooksDefinition
} from '../../../lib/stores/engineStore';

export function loadSchema(elementType: string, components: string[] = []): Schema {
  const baseDef = getDefinition(elementType, 'base') as BaseOrComponentDefinition | null;
  let fields: FieldDefinition[] = [...(baseDef?.fields || [])];

  for (const component of components) {
    const componentDef = getDefinition(elementType, component) as BaseOrComponentDefinition | null;
    if (componentDef?.fields) {
      fields.push(...componentDef.fields);
    } else if (component == "debug") {
      for (const availableComponent of getAvailableComponentsForType(elementType)) {
        const componentDefinition = getDefinition(elementType, availableComponent) as BaseOrComponentDefinition | null;
        if (componentDefinition?.fields) {
          fields.push(...componentDefinition.fields);
        }
      }
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
    console.warn(`No hooks.json found for ${elementType}`);
  }

  const types = globalTypesDefinition as Record<string, any>;

  return { type: elementType, fields, availableHooks: hooks, types };
}
