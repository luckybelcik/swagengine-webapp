<script>
  import { engineStore, updateElement, deleteElement, FIXED_ELEMENT_TYPES } from '$lib/stores/engineStore';
  import { removeTab, setTabName } from '$lib/stores/editorTabsStore'; // To close the tab on delete

  /**
   * @type {string}
   * @description The ID of the element this tab is editing.
   */
  // @ts-ignore
  export let elementId;

  // Reactive access to the element data from the store
  $: element = $engineStore.elements.find(e => e.id === elementId);

  // Local state for the JSON textarea to handle invalid JSON gracefully
  let elementDataJson = '';
  // Update local JSON string when element.data changes from store
 // @ts-ignore
   $: if (element && element.data) {
    elementDataJson = JSON.stringify(element.data, null, 2);
  }

  // --- Handlers for Input Changes ---

  // @ts-ignore
  function handleNameChange(event) {
    if (element) {
      updateElement(element.id, { name: event.target.value });
      setTabName(element.id, event.target.value); // Update tab name to match element name
    }
  }

  // @ts-ignore
  function handleTypeChange(event) {
    if (element) {
      updateElement(element.id, { type: event.target.value });
    }
  }

  // @ts-ignore
  function handleDataJsonChange(event) {
    if (!element) return;
    try {
      const parsedData = JSON.parse(event.target.value);
      updateElement(element.id, { data: parsedData });
      // Clear error message if successful
      // dataJsonErrorMessage = ''; // If you add an error message state
    } catch (error) {
      console.error("Invalid JSON:", error);
      // Set an error message state to display to the user
      // dataJsonErrorMessage = 'Invalid JSON format.';
    }
  }

  function handleDeleteElement() {
    if (element && confirm(`Are you sure you want to delete element "${element.name}" (${element.id})?`)) {
      deleteElement(element.id); // Delete from engineStore
      removeTab(element.id);      // Close the corresponding tab
    }
  }

</script>

<div class="h-full overflow-y-auto p-4" id="tab-content-{elementId}" role="tabpanel" aria-labelledby="tab-header-{elementId}">
  {#if element}
    <h2 class="text-3xl font-bold mb-4">Editing: {element.name} ({element.type})</h2>
    <p class="text-lg mb-6">ID: <span class="font-mono bg-base-300 p-1 rounded text-sm">{element.id}</span></p>

    <div class="mb-4">
      <label class="form-control w-full mb-2">
        <div class="label">
          <span class="label-text">Element Name</span>
        </div>
        <input
          type="text"
          class="input input-bordered w-full"
          value={element.name}
          on:change={handleNameChange}
        />
      </label>

      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Element Type</span>
        </div>
        <select
          class="select select-bordered w-full"
          value={element.type}
          on:change={handleTypeChange}
        >
          {#each FIXED_ELEMENT_TYPES as type}
            <option value={type}>{type}</option>
          {/each}
        </select>
      </label>
    </div>

    <div class="bg-base-200 p-4 rounded-box shadow-inner">
      <h3 class="text-xl font-semibold mb-2">Element Data (JSON)</h3>
      <textarea
        class="textarea textarea-bordered w-full h-48 font-mono"
        placeholder="Element JSON data..."
        value={elementDataJson}
        on:change={handleDataJsonChange}
      ></textarea>
    </div>

    <p class="text-xl font-bold mt-7">Methods</p>

    <div class="grid grid-cols-fill-180 grid-cols-7 gap-4 mt-3">
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
      <button class="btn btn-error" on:click={handleDeleteElement}>Delete Element</button>
      </div>

  {:else}
    <p class="text-error">Element with ID "{elementId}" not found!</p>
    <p>It might have been deleted or never existed.</p>
  {/if}
</div>