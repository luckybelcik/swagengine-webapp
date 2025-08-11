<script lang="ts">
    import { addImage } from "$lib/stores/userPreferenceStore";

  let isEditing: boolean = false;
  let newImageName: string = "";

  function handleButtonClick() {
    isEditing = true;
  }

  function handleInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (newImageName.trim() !== "") {
        addImage(newImageName);
        newImageName = "";
        isEditing = false;
      }
    }

    if (event.key === 'Escape') {
      isEditing = false;
      newImageName = "";
    }
  }

  function focusOnMount(node: HTMLInputElement) {
    node.focus();
  }
</script>

{#if isEditing}
  <input
    type="text"
    placeholder="Enter image name..."
    class="input input-bordered w-full mt-2"
    use:focusOnMount
    on:keydown={handleInputKeydown}
    bind:value={newImageName}
  />
{:else}
  <button 
    class="btn bg-base-100 w-full mt-2 z-10" 
    on:click={handleButtonClick}
  >
    Add Image
  </button>
{/if}