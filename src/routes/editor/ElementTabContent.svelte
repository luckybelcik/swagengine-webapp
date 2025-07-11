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
    import { idValidation, nameValidation } from './utils/validation.js';
    import Navbar from '$lib/components/Navbar.svelte';

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

  let NameErrorMessage = $state('');

  // @ts-ignore
  function handleNameChange(event) {
    if (element) {
      const name = event.target.value;
      const validation = nameValidation(name);

      if (validation !== 'safe') {
        NameErrorMessage = validation;
        return;
      }

      NameErrorMessage = '';

      updateElement(element.id, { name: name });
      setTabName(element.id, name); // Update tab name to match element name
      element.name = name;
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
  <label class="form-control w-full pl-4">
    <div class="label">
      <span class="label-text">Element Name</span>
    </div>
    <input
      type="text"
      class="input input-bordered w-auto ml-3 {NameErrorMessage ? 'input-error' : ''}"
      value={element.name}
      onchange={handleNameChange}
    />
  </label>

  {#if NameErrorMessage}
    <div class="label">
      <span class="label-text-alt text-error">{NameErrorMessage}</span>
    </div>
  {/if}

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
        <div class="field flex items-center">
          <label
            class="bg-base-200 text-base-content px-4 py-2 rounded-lg font-bold w-1/3 shrink-0"
            for={field.name}
          >
            {field.name}
          </label>

          {#if field.type === "integer"}
            <input
              id={field.name}
              type="number"
              step="1"
              value={element.data?.[field.name] ?? ''}
              oninput={(e: Event) => {
                const target = e.target as HTMLInputElement;
                updateField(field.name, parseInt(target.value, 10));
              }}
              class="input input-bordered w-full"
            />

          {:else if field.type === "float"}
            <input
              id={field.name}
              type="number"
              step="any"
              value={element.data?.[field.name] ?? ''}
              oninput={(e: Event) => {
                const target = e.target as HTMLInputElement;
                updateField(field.name, parseFloat(target.value));
              }}
              class="input input-bordered w-full"
            />

          {:else if field.type === "boolean"}
            <input
              id={field.name}
              type="checkbox"
              checked={element.data?.[field.name] ?? false}
              onchange={(e: Event) => {
                const target = e.target as HTMLInputElement;
                updateField(field.name, target.checked);
              }}
              class="toggle toggle-primary"
            />

          {:else if schema.types?.[`enum_${field.type}`]}
            <select
              id={field.name}
              value={element.data?.[field.name] ?? ''}
              onchange={(e: Event) => {
                const target = e.target as HTMLSelectElement;
                updateField(field.name, target.value);
              }}
              class="select select-bordered w-full"
            >
              <option disabled selected value="">-- Select {field.type} --</option>
              {#each getEnumValues(field.type) as opt}
                <option value={opt}>{opt}</option>
              {/each}
            </select>

          {:else}
            <input
              id={field.name}
              type="text"
              value={element.data?.[field.name] ?? ''}
              oninput={(e: Event) => {
                const target = e.target as HTMLInputElement;
                updateField(field.name, target.value);
              }}
              class="input input-bordered w-full"
            />
          {/if}
        </div>
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