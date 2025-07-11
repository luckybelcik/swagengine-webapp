<script lang="ts">
    let { children } = $props();
    import "../../app.css";
    import Navbar from "$lib/components/Navbar.svelte";
    import { openTabs, activeTabId, setActiveTab, removeTab, openElementTab } from '$lib/stores/editorTabsStore';
    import { engineStore, createNewElement, elementIdExists, FIXED_ELEMENT_TYPES,
      getEngineVersion, getWebAppVersion, getProjectName, getProjectVersion, getElementCount } from '$lib/stores/engineStore';
    import { loadSchema } from "./utils/schemaLoader.js";
    import { getAvailableComponentsForType, getDefinition } from "../../lib/data/_definitions"
    import { idValidation, nameValidation, typeValidation } from "./utils/validation";

    // --- Modal State and Logic ---
  let showCreateElementModal = $state(false);
  let newElementNameInput = $state('');
  let newElementIdInput = $state('');
  let newElementTypeInput = $state('');
  let newElementComponents = $state('');
  let ErrorMessage = $state('');
  let ErrorField = $state(0);
  let elementCount = $state(getElementCount());

  const NameError = 0b0001;
  const IdError = 0b0010;
  const TypeError = 0b0100;
  const ComponentError = 0b1000;

  const EngineVersion = getEngineVersion();
  const WebAppVersion = getWebAppVersion();

  function openCreateElementModal() {
    newElementNameInput = '';
    newElementIdInput = '';
    newElementTypeInput = '';
    newElementComponents = '';
    ErrorMessage = '';
    ErrorField = 0;
    showCreateElementModal = true;
  }

  function closeCreateElementModal() {
    showCreateElementModal = false;
  }

  function handleCreateElement() {
    ErrorMessage = '';
    ErrorField = 0;
    const newName = newElementNameInput.trim();
    const newId = newElementIdInput.trim().toLowerCase().replace(/ /g,"_");
    const newType = newElementTypeInput.trim().toLowerCase().replace(/ /g,"_");
    const newComponents: string[] = newElementComponents
    .trim()
    .toLowerCase()
    .split(',')
    .map(c => c.trim())
    .map(c => c.replace(/ /g,"_"))
    .map(c=> c.endsWith("_component") ? c : c.concat("_component"));

    let validation;

    // name checks

    validation = nameValidation(newName);
    console.log('VALIDATION:', validation);
    if (validation !== 'safe') {
      ErrorMessage = validation;
      ErrorField |= NameError;
      return;
    }

    // id checks

    validation = idValidation(newId);
    if (validation !== 'safe') {
      ErrorMessage = validation;
      ErrorField |= IdError;
      return;
    }

    // type checks

    validation = typeValidation(newType);
    if (validation !== 'safe') {
      ErrorMessage = validation;
      ErrorField |= TypeError;
      return;
    }

    try {
      let newElement = null;
      if (newComponents.length == 1 && newComponents[0] == "debug_component") {
        const newerComponents = getAvailableComponentsForType(newElementTypeInput);
        newElement = createNewElement(newName, newId, newType, newerComponents);
      } else {
        newElement = createNewElement(newName, newId, newType, newComponents);
      }
      console.log(`Created new element with ID: ${newId} and Type: ${newType}`);
      console.log(`New element:`, newElement);
      elementCount++;
      closeCreateElementModal();
    } catch (error) {
      // @ts-ignore
      console.error("Error creating element:", error.message);
      // @ts-ignore
      ErrorMessage = `Failed to create element: ${error.message}`;
    }
  }
</script>

<div class="flex flex-col min-h-screen">
    <div class="shadow-sm">
        <Navbar />
    </div>

    <div class="flex flex-grow overflow-hidden">
        <div class="w-64 bg-base-300 shadow-lg p-4 flex-none overflow-y-auto">
            <h2 class="text-xl font-semibold mb-4">Sidebar Menu</h2>
            <ul class="menu mb-4 bg-base-200 rounded-box">
                <li class="menu-title"><span>Element Management</span></li>
                <li><button onclick={openCreateElementModal}>Add New Element</button></li>
            </ul>
            <div class="p-2 border-t border-base-content/10">
                <p class="text-sm text-base-content/80">{elementCount} elements</p>
                <p class="text-sm text-base-content/80">0 methods</p>
                <p class="text-sm text-base-content/80">0 assets</p>
            </div>
            <div class="p-2 border-t border-base-content/10">
                <p class="text-sm text-base-content/80">Engine v{EngineVersion}</p>
                <p class="text-sm text-base-content/80">Redbud v{WebAppVersion}</p>
                <p class="text-sm text-base-content/80">{getProjectName()} v{getProjectVersion()}</p>
            </div>
        </div>

        
        <main class="flex-grow">
            {@render children()}
        </main>
    </div>

    {#if showCreateElementModal}
      <dialog open class="modal modal-open">
        <div class="modal-box">
          <h3 class="font-bold text-lg">New Element</h3>
          <p class="mt-4 mb-2">The element names will be used for the english translation file</p>
          <p class="mb-4">Element IDs are used by developers and in commands</p>

          <label class="form-control w-full">

            <div class="label">
              <span class="label-text">Element Name</span>
            </div>
            <input
              type="text"
              placeholder="e.g., New Element"
              class="input input-bordered w-full {ErrorField & (1 << 0) ? 'input-error' : ''}"
              bind:value={newElementNameInput}
            />
            
            <div class="label mt-3">
              <span class="label-text">Element ID</span>
            </div>
            <input
              type="text"
              placeholder="e.g., my_new_element"
              class="input input-bordered w-full {ErrorField & (1 << 1) ? 'input-error' : ''}"
              bind:value={newElementIdInput}
            />

            <div class="label mt-3">
              <span class="label-text">Element Type</span>
            </div>
            <input
              type="text"
              placeholder="e.g., item, entity, command"
              class="input input-bordered w-full {ErrorField & (1 << 2) ? 'input-error' : ''}"
              bind:value={newElementTypeInput}
            />

            <div class="label mt-3">
              <span class="label-text">Components</span>
            </div>
            <input
              type="text"
              placeholder="different based on element type"
              class="input input-bordered w-full {ErrorField & (1 << 3) ? 'input-error' : ''}"
              bind:value={newElementComponents}
            />

            {#if ErrorMessage}
              <div class="label">
                <span class="label-text-alt text-error">{ErrorMessage}</span>
              </div>
            {/if}
          </label>

          <div class="modal-action">
            <button class="btn btn-ghost" onclick={closeCreateElementModal}>Cancel</button>
            <button class="btn btn-primary" onclick={handleCreateElement}>Create Element</button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop" onclick={closeCreateElementModal}>
            <button>close</button>
        </form>
      </dialog>
    {/if}
</div>