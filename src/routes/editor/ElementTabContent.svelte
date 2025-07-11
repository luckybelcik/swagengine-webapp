<script lang="ts">
  import { get } from 'svelte/store';
  import { loadSchema } from './utils/schemaLoader.js';
  import {
    engineStore,
    updateElement,
    deleteElement,
    type Schema,
    type Element
  } from '$lib/stores/engineStore';
  import { removeTab, setTabName } from '$lib/stores/editorTabsStore.js'
  import { nameValidation } from './utils/validation.js';
  import FieldRenderer from '$lib/components/FieldRenderer.svelte';
  import ValidatedInput from '$lib/components/ValidatedInput.svelte';

  const { elementId } = $props<{ elementId: string }>();

  let schema = $state<Schema | null>(null);
  let element = $state<Element | undefined>(undefined);

  $effect(() => {
    const store = get(engineStore);
    element = store.elements.find(el => el.id === elementId);
    if (element) {
      schema = loadSchema(element.type, element.data?.components ?? []);
      console.log('element:', element);
      console.log('schema:', schema);
    }
  });

  function getEnumValues(typeName: string): string[] {
    const enumDef = schema?.types?.[`enum_${typeName}`];
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
      removeTab(element.id);
    }
  }

  function openRawDataModal() {
    const modal = document.getElementById('raw_data_modal');
    if (modal instanceof HTMLDialogElement) { // Ensure it's a dialog element
      modal.showModal();
    }
  }
</script>

{#if schema && element}
  <ValidatedInput
    label="Element Name"
    value={element.name}
    validate={nameValidation}
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
  
  <div class="collapse collapse-arrow form">
    <input type="checkbox" />
    <div class="collapse-title">
      <div class="text-xl font-bold w-full">Element Data</div>
    </div>
    <div class="collapse-content space-y-3">
      {#each schema.fields as field (field.name)}
        <FieldRenderer
          {field}
          value={element.data?.[field.name]}
          {getEnumValues}
          onChange={updateField}
        />
      {/each}
    </div>
  </div>

  <div class="divider"></div>

  <p class="text-xl font-bold p-4">Methods</p>

  <div class="grid grid-cols-fill-180 grid-cols-7 gap-4 p-4">
    {#each element.methods as method (method)}
      <button
        class="card bg-base-200 shadow-sm hover:bg-base-300 transition-colors cursor-pointer"
      >
        <div class="card-body p-4">
          <h4 class="text-lg font-bold mb-1 truncate text-center">{method.type}</h4>
          <p class="text-sm opacity-70">Length: {method.code.length}</p>
          </div>
      </button>
    {/each}
  </div>

  <div class="mt-6 flex justify-end gap-2">
    <button class="btn btn-base" onclick={openRawDataModal}>View Raw Data</button>
    <button class="btn btn-error" onclick={handleDeleteElement}>Delete Element</button>
  </div>

  <dialog id="raw_data_modal" class="modal">
    <div class="modal-box w-11/12 max-w-5xl">
      <h3 class="font-bold text-lg">Raw Element Data</h3>
      <p>Note: if you just changed the element ID, you need to re-open the tab for the change to take place</p>
      <div class="py-4">
        {#if element}
          <pre class="bg-base-300 p-3 rounded-md overflow-auto text-sm text-base-content max-h-96">{JSON.stringify(element, null, 2).trim()}</pre>
        {:else}
          <p class="text-gray-500 italic">No element selected or loaded.</p>
        {/if}
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
  
{:else}
  <p class="text-center text-gray-500 p-4">No schema loaded or element not found.</p>
{/if}