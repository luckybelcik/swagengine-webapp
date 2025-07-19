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

    removeComponent


  } from '$lib/stores/engineStore';
  import { closeTab, reloadTab, setTabName, activeTabId } from '$lib/stores/editorTabsStore.js'
  import { softValidation } from './utils/validation.js';
  import FieldRenderer from './components/FieldRenderer.svelte';
  import ValidatedInput from './components/ValidatedInput.svelte';
  import MethodsGrid from './components/MethodsGrid.svelte';
  import RawDataModal from './components/RawDataModal.svelte';
  import ComponentModificationModal from './components/ComponentModificationModal.svelte';

  const { elementId } = $props<{ elementId: string }>();

  const store = $derived(get(engineStore));

  let element = $derived(store.elements.find(el => el.id === elementId));

  let schema = $derived(() => {
    if (element) {
      return loadSchema(element.type, element.data?.components ?? []);
    }
    return null;
  });

  function getEnumValues(typeName: string): string[] {
    const resolvedSchema = typeof schema === 'function' ? schema() : schema;
    const enumDef = resolvedSchema?.types?.[`enum_${typeName}`];
    return enumDef?.type === "enum" ? enumDef.values : [];
  }

  function updateField(name: string, value: any) {
    if (!element) return;
    updateElement(element.id, {
      data: {
        ...element.data,
        [name]: value
      }
    });
  }

  function handleNameChange(event: any) {
    if (event.detail.valid && element) {
      updateElement(element.id, { name: event.detail.value });
      setTabName(element.id, event.detail.value); // Update tab name to match element name
      element.name = event.detail.value;
    }
  }

  function handleDeleteElement() {
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
</script>

{#if schema() && element}
  <ValidatedInput
    label="Element Name"
    value={element.name}
    validate={softValidation}
    on:change={handleNameChange}
  />

  <div class="w-full pl-4 p-2 pb-1">
    <div class="label">
      <span class="label-text">Element ID</span>
    </div>
    <div class="input w-auto opacity-60 ml-3">{element.id}</div>
  </div>

  <div class="w-full pl-4 p-1">
    <div class="label">
      <span class="label-text">Element Type</span>
    </div>
    <div class="input w-auto opacity-60 ml-3">{element.type}</div>
  </div>

  <div class="divider"></div>
  
  <div class="collapse collapse-arrow form relative">
    <input type="checkbox" />
    <div class="collapse-title">
      <div class="text-xl font-bold w-full">Element Data</div>
    </div>
    <div class="collapse-content space-y-3">
      {#if schema()?.components}
        {#each schema().components as component (component.name)}
          <div class="flex justify-between items-center w-full">
            <div class="text-xl font-bold">{component.name}</div>
          </div>
          {#each component.fields as field }
            <FieldRenderer
              {field}
              value={element.data?.[field.name]}
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
    methods={element.methods}
  />

  <div class="mt-6 flex justify-end gap-2">
    <button class="btn btn-base" onclick={openRawDataModal}>View Raw Data</button>
    <button class="btn btn-error" onclick={handleDeleteElement}>Delete Element</button>
  </div>

  <RawDataModal
    bind:showModal={showRawDataModal}
    element={element}
    schema={schema()}
  />

  <ComponentModificationModal
    bind:showModal={showComponentModificationModal}
    element={element}
  />
  
{:else}
  <p class="text-center text-gray-500 p-4">No schema loaded or element not found.</p>
{/if}