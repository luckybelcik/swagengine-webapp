<script lang="ts">
    import { getComponentsForType } from "$lib/data/_definitions";
    import { activeTabId } from "$lib/stores/editorTabsStore";
    import { engineStore } from "$lib/stores/engineStore";
    import ComponentCard from "./ComponentCard.svelte";
    
  let { showModal = $bindable() } = $props<{
    showModal: boolean;
  }>();

  const activeElement = $derived(() => {
    const engineStoreValue = $engineStore;
    const activeTabIdValue = $activeTabId;

    if (!activeTabIdValue || activeTabIdValue === 'browser') {
      return undefined;
    }

    const element = engineStoreValue.elements.find(el => el.id === activeTabIdValue);
    return element;
  });

  let dialogElement: HTMLDialogElement;

  $effect(() => {
    if (dialogElement) {
      if (showModal && !dialogElement.open) {
        dialogElement.showModal();
      } else if (!showModal && dialogElement.open) {
        dialogElement.close();
      }
    }
  });

  function handleClickOutside(event: MouseEvent) {
    if (event.target === dialogElement) {
      closeModal();
    }
  }

  function closeModal() {
    showModal = false;
  }
</script>

<dialog
  bind:this={dialogElement}
  class="modal"
  onclose={closeModal}
  onclick={handleClickOutside}
>
  <div class="modal-box w-11/12 max-w-5xl">
    <h3 class="font-bold text-lg text-center">Add Component</h3>
    <div class="py-4">
      {#if !activeElement()}
        <p class="text-gray-500 italic">No element selected or loaded.</p>
      {:else}
        <div class="grid grid-cols-fill-180 grid-cols-4 gap-4 p-4">
          {#if getComponentsForType(activeElement().type) == undefined && getComponentsForType(activeElement().type).length <= 0}
            <p>No components found :C</p>
          {:else}
            {#each getComponentsForType(activeElement().type) as componentName}
              <ComponentCard
                activeElement={activeElement()}
                componentName={componentName}
              ></ComponentCard>
            {/each}
          {/if}  
        </div>
      {/if}
    </div>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-success" onclick={closeModal}>Save</button>
      </form>
    </div>
  </div>
</dialog>