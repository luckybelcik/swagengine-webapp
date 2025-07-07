<script>
    let { children } = $props();
    import "../../app.css";
    import Navbar from "$lib/components/Navbar.svelte";
    // @ts-ignore
    import { openTabs, activeTabId, setActiveTab, removeTab, openElementTab } from '$lib/stores/editorTabsStore';
    // @ts-ignore
    import { engineStore, createNewElement, elementIdExists } from '$lib/stores/engineStore';

    // --- Modal State and Logic ---
  let showCreateElementModal = $state(false);
  let newElementIdInput = $state('');
  let idErrorMessage = $state('');

  function openCreateElementModal() {
    newElementIdInput = ''; // Clear previous input
    idErrorMessage = '';    // Clear previous errors
    showCreateElementModal = true;
  }

  function closeCreateElementModal() {
    showCreateElementModal = false;
  }

  function handleCreateElement() {
    idErrorMessage = ''; // Clear previous error messages
    const newElementIdInputSwag = newElementIdInput.trim().toLowerCase().replace(/ /g,"_");

    // 1. Basic Validation
    if (!newElementIdInputSwag) {
      idErrorMessage = 'Element ID cannot be empty.';
      return;
    }

    // 2. Uniqueness Check
    if (elementIdExists(newElementIdInputSwag)) {
      idErrorMessage = `Element ID '${newElementIdInputSwag}' already exists.`;
      return;
    }

    // 3. Add regex for valid ID characters (e.g., only alphanumeric and underscores)
    if (!/^[a-zA-Z0-9_]+$/.test(newElementIdInputSwag)) {
        idErrorMessage = 'ID can only contain letters, numbers, and underscores.';
        return;
    }

    // 4. Length Check
    if (newElementIdInputSwag.length < 3 || newElementIdInputSwag.length > 20) {
      idErrorMessage = 'ID must be between 3 and 20 characters long.';
      return;
    }

    // 5. Evil Underscore Check
    if (newElementIdInputSwag.startsWith('_') || newElementIdInputSwag.endsWith('_')) {
      idErrorMessage = 'ID cannot start or end with an underscore.';
      return;
    }

    // 6. Create Element and Open Tab
    try {
      // @ts-ignore
      const newElement = createNewElement(newElementIdInputSwag);
      closeCreateElementModal(); // Close the modal on success
    } catch (error) {
      // This catch is primarily for unexpected errors from createNewBlankElement,
      // as ID uniqueness is already checked.
      // @ts-ignore
      console.error("Error creating element:", error.message);
      // @ts-ignore
      idErrorMessage = `Failed to create element: ${error.message}`;
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
            <ul class="menu bg-base-200 rounded-box">
                <li class="menu-title"><span>Element Management</span></li>
                <li><button onclick={openCreateElementModal}>Add New Element</button></li>
            </ul>
            <div class="mt-4 p-2 border-t border-base-content/10">
                <p class="text-sm text-base-content/80">0 elements</p>
                <p class="text-sm text-base-content/80">0 methods</p>
                <p class="text-sm text-base-content/80">0 assets</p>
            </div>
            <div class="mt-4 p-2 border-t border-base-content/10">
                <p class="text-sm text-base-content/80">Engine v0.0.0</p>
                <p class="text-sm text-base-content/80">Redbud v0.0.0</p>
            </div>
        </div>

        
        <main class="flex-grow">
            {@render children()}
        </main>
    </div>

    {#if showCreateElementModal}
      <dialog open class="modal modal-open">
        <div class="modal-box">
          <h3 class="font-bold text-lg">Enter New Element ID</h3>
          <p class="py-4">Please provide a unique identifier for your new element. (e.g., `my_new_item`, `player_spawn_point`)</p>

          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Element ID</span>
            </div>
            <input
              type="text"
              placeholder="e.g., my_new_element"
              class="input input-bordered w-full {idErrorMessage ? 'input-error' : ''}"
              bind:value={newElementIdInput}
              onkeydown={(e) => { if (e.key === 'Enter') handleCreateElement(); }}
            />
            {#if idErrorMessage}
              <div class="label">
                <span class="label-text-alt text-error">{idErrorMessage}</span>
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