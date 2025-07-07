<!-- src/lib/components/ProjectNameEditor.svelte -->
<script>
    import { page } from '$app/stores';
    import { engineStore, setProjectName } from '$lib/stores/engineStore';

    let isEditingName = false;  
    // Local variable to hold the input value while editing
    // This prevents the store from being updated on every keystroke,
    // only when editing finishes.
    let currentInputName = '';  
    // Function to start editing
    function startEditingName() {
      isEditingName = true;
      currentInputName = $engineStore.projectData.name; // Initialize with current project name
    }   
    function finishEditingName() {
      if (isEditingName) {
        // Trim whitespace and ensure it's not empty
        const newName = currentInputName.trim();
        if (newName !== '' && newName !== $engineStore.projectData.name && newName.length <= 50) {
          setProjectName(newName); // Update the store
        } else if (newName === '') {
          // Revert to old name or show an error if empty
          currentInputName = $engineStore.projectData.name;
        }
        isEditingName = false; // Exit editing mode
      }
    }

  // Handle Enter key press to save
  /**
     * @param {{ key: string; }} event
     */
  function handleKeydown(event) {
    if (event.key === 'Enter') {
      finishEditingName();
    } else if (event.key === 'Escape') {
      // Revert changes on Escape key
      currentInputName = $engineStore.projectData.name;
      isEditingName = false;
    }
  }

  // Focus the input when editing starts
  /**
     * @param {{ focus: () => void; }} node
     */
  function focusInput(node) {
    node.focus();
  }
</script>

<div class="flex-1 bg-base-200">
    <a
        href={$page.url.pathname === '/editor' ? '/editor/settings' : '/editor'}
        aria-label="Open settings"
        tabindex="0"
        class="btn m-1 btn-square btn-lg bg-base-300 hover:bg-base-200"
    >
        <svg
            width="35px"
            height="35px"
            class="fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
        
            <path d="M4,13.743l-1,.579a1,1,0,0,0-.366,1.366l1.488,2.578a1,1,0,0,0,1.366.366L6.5,18.05a1.987,1.987,0,0,1,1.986,0l.02.011a1.989,1.989,0,0,1,1,1.724V21a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V19.782a1.985,1.985,0,0,1,.995-1.721l.021-.012a1.987,1.987,0,0,1,1.986,0l1.008.582a1,1,0,0,0,1.366-.366l1.488-2.578A1,1,0,0,0,21,14.322l-1-.579a1.994,1.994,0,0,1-1-1.733v-.021a1.991,1.991,0,0,1,1-1.732l1-.579a1,1,0,0,0,.366-1.366L19.876,5.734a1,1,0,0,0-1.366-.366L17.5,5.95a1.987,1.987,0,0,1-1.986,0L15.5,5.94a1.989,1.989,0,0,1-1-1.724V3a1,1,0,0,0-1-1h-3a1,1,0,0,0-1,1V4.294A1.856,1.856,0,0,1,8.57,5.9l-.153.088a1.855,1.855,0,0,1-1.853,0L5.49,5.368a1,1,0,0,0-1.366.366L2.636,8.312A1,1,0,0,0,3,9.678l1,.579A1.994,1.994,0,0,1,5,11.99v.021A1.991,1.991,0,0,1,4,13.743ZM12,9a3,3,0,1,1-3,3A3,3,0,0,1,12,9Z"/>
        </svg>
    </a>

    {#if isEditingName}
        <input
            type="text"
            class="input input-ghost m-1 text-xl"
            bind:value={currentInputName}
            on:blur={finishEditingName}
            on:keydown={handleKeydown}
            use:focusInput
            aria-label="Edit project name"
        />
    {:else}
        <button
            type="button"
            class="btn btn-ghost bg-base-300 m-0 text-xl p-2"
            on:click={startEditingName}
            aria-label="Project name: {$engineStore.projectData.name}. Click to edit."
        >
            {$engineStore.projectData.name}
        </button>
    {/if}
</div>