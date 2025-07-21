<script lang="ts">
  import { get } from 'svelte/store';
  import { loadSchema } from './utils/schemaLoader.js';
  import {
    engineStore,
    updateElement,
    deleteElement,
    type Schema,
    type Element,

    getAllFields,

    removeComponent,

    type Field



  } from '$lib/stores/engineStore';
  import { closeTab, reloadTab, setTabName, activeTabId } from '$lib/stores/editorTabsStore.js'
  import { softValidation } from './utils/validation.js';
  import FieldRenderer from './components/FieldRenderer.svelte';
  import ValidatedInput from './components/ValidatedInput.svelte';
  import MethodsGrid from './components/MethodsGrid.svelte';
  import RawDataModal from './components/RawDataModal.svelte';
  import ComponentModificationModal from './components/ComponentModificationModal.svelte';
  import { onMount } from 'svelte';

  const activeElement = $derived(() => {
    const engineStoreValue = $engineStore;
    const activeTabIdValue = $activeTabId;

    if (!activeTabIdValue || activeTabIdValue === 'browser') {
      return undefined;
    }

    const element = engineStoreValue.elements.find(el => el.id === activeTabIdValue);
    console.debug("Updated element")
    return element;
  });

  let schema = $derived(() => {
    const element = activeElement()
    if (element) {
      return loadSchema(element.type);
    }
    return null;
  });

  function getEnumValues(typeName: string): string[] {
    const resolvedSchema = typeof schema === 'function' ? schema() : schema;
    const enumDef = resolvedSchema?.types?.[`enum_${typeName}`];
    return enumDef?.type === "enum" ? enumDef.values : [];
  }

  function updateField(name: string, value: any) {
    const element = activeElement()
    if (!element) return;
    updateElement(element.id, {
      data: {
        ...element.data,
        [name]: value
      }
    });
  }

  function handleNameChange(newName: string, valid: boolean) {
    const element = activeElement()
    if (valid && element) {
      updateElement(element.id, { name: newName });
      setTabName(element.id, newName);
      element.name = newName;
    }
  }

  function handleDeleteElement() {
    const element = activeElement()
    if (element && confirm(`Are you sure you want to delete element "${element.name}" (${element.id})?`)) {
      deleteElement(element.id);
      closeTab(element.id);
    }
  }

  let showRawDataModal: boolean = $state(false);

  function openRawDataModal() {
    showRawDataModal = true;
  }

  let showComponentModificationModal: boolean = $state(false);

  function openComponentModificationModal() {
    showComponentModificationModal = true;
  }

  function getComponentFields(component_name: string): Field[]{
    const allComponents = schema()?.components;
    const component = allComponents?.find(component => component_name == component.name)
    if (component?.fields) {
      return component?.fields;
    } else {
      return [];
    }
  }
</script>

{#if schema() && activeElement()}
  <ValidatedInput
    label="Element Name"
    value={activeElement()?.name}
    validate={softValidation}
    onChange={handleNameChange}
  />

  <div class="w-full pl-4 p-2 pb-1">
    <div class="label">
      <span class="label-text">Element ID</span>
    </div>
    <div class="input w-auto opacity-60 ml-3">{activeElement()?.id}</div>
  </div>

  <div class="w-full pl-4 p-1">
    <div class="label">
      <span class="label-text">Element Type</span>
    </div>
    <div class="input w-auto opacity-60 ml-3">{activeElement()?.type}</div>
  </div>

  <div class="divider"></div>
  
  <div class="collapse collapse-arrow form relative">
    <input type="checkbox" />
    <div class="collapse-title">
      <div class="text-xl font-bold w-full">Element Data</div>
    </div>
    <div class="collapse-content space-y-3">
      {#if activeElement()?.data.components}
        {#each activeElement()?.data.components as componentName}
          <div class="flex justify-between items-center w-full">
            <div class="text-xl font-bold">{componentName}</div>
          </div>
          {#each getComponentFields(componentName) as field }
            <FieldRenderer
            {field}
            value={activeElement()?.data?.[field.name]}
            {getEnumValues}
            onChange={updateField}
            />
          {/each}
        {/each}
      {/if}
      <button class="btn w-full" onclick={openComponentModificationModal}>Modify Components</button>
    </div>
  </div>

  <div class="divider"></div>

  <p class="text-xl font-bold p-4">Methods</p>

  <MethodsGrid
    methods={activeElement()?.methods}
  />

  <div class="mt-6 flex justify-end gap-2">
    <button class="btn btn-base" onclick={openRawDataModal}>View Raw Data</button>
    <button class="btn btn-error" onclick={handleDeleteElement}>Delete Element</button>
  </div>

  <RawDataModal
    bind:showModal={showRawDataModal}
    element={activeElement()}
    schema={schema()}
  />

  <ComponentModificationModal
    bind:showModal={showComponentModificationModal}
  />
  
{:else}
  <p class="text-center text-gray-500 p-4">No schema loaded or element not found.</p>
{/if}