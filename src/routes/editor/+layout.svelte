<script lang="ts">
    let { children } = $props();
    import "../../app.css";
    import Navbar from "$lib/components/Navbar.svelte";
    import { createNewElement,
      engineStore} from '$lib/stores/engineStore';
    import { strictValidation, softValidation, typeValidation } from "./utils/util";
    import FormModal from "./components/FormModal.svelte";
    import { FIXED_ELEMENT_TYPES } from "$lib/data/_constant_data";
    import { get } from "svelte/store";

    // --- Modal State and Logic ---
  let showCreateElementModal = $state(false);
  let ErrorMessage = $state('');
  let ErrorField = $state('');
  let elementCount = $state(get(engineStore).elements.length);

  const EngineVersion = get(engineStore).projectData.engineVersion;
  const WebAppVersion = get(engineStore).projectData.webAppVersion;

  function openCreateElementModal() {
    ErrorMessage = '';
    ErrorField = '';
    showCreateElementModal = true;
  }

  function closeCreateElementModal() {
    showCreateElementModal = false;
  }

  function handleCreateElement(values: Record<string, string>) {
    ErrorMessage = '';
    ErrorField = '';

    const newName = values.elementName.trim();
    const newId = values.elementID.trim().toLowerCase().replace(/ /g,"_");
    const newType = values.elementType.trim().toLowerCase().replace(/ /g,"_");

    let validation;

    validation = softValidation(newName);
    
    if (validation !== 'safe') {
      ErrorMessage = validation;
      ErrorField = 'elementName';
      return;
    }

    validation = strictValidation(newId);
    if (validation !== 'safe') {
      ErrorMessage = validation;
      ErrorField = 'elementID';
      return;
    }

    validation = typeValidation(newType);
    if (validation !== 'safe') {
      ErrorMessage = validation;
      ErrorField = 'elementType';
      return;
    }

    try {
      let newElement = null;
      newElement = createNewElement(newName, newId, newType);

      console.log(`Created new element with ID: ${newId} and Type: ${newType}`);
      console.log(`New element:`, newElement);
      elementCount++;
      closeCreateElementModal();
    } catch (error: any) {
      console.error("Error creating element:", error.message);
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
        <p class="text-sm text-base-content/80">{get(engineStore).projectData.name} v{get(engineStore).projectData.projectVersion}</p>
      </div>
    </div>

    
    <main class="flex-grow">
      {@render children()}
    </main>
  </div>

  <FormModal
    title="New Element"
    show={showCreateElementModal}
    onClose={closeCreateElementModal}
    onSubmit={handleCreateElement}
    fields={[
      { name: "elementName", label: "Element Name", placeholder: "e.g., New Element", 
        description: "The element names will be used for the english translation file."},
      { name: "elementID", label: "Element ID", placeholder: "e.g., new_element", 
        description: "Element IDs are used for element identification in code, etc. They can't be changed directly after creation because it corrupts existing items of that ID"},
      { name: "elementType", label: "Element Type", placeholder: "e.g., item, entity, tile", 
        description: "Element types determine basic behavior",
        type: "enum", enum_values: [...FIXED_ELEMENT_TYPES] }
    ]}
    errorMessage={ErrorMessage}
    errorField={ErrorField}
  />
</div>