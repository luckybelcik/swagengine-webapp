<script lang="ts">
    import { getAvailableComponentsForType, getNumberOfFieldsOnComponent } from "$lib/data/_definitions";
    import { addComponent } from "$lib/stores/engineStore";

  let { showModal = $bindable(), element } = $props<{
    showModal: boolean;
    element: any;
  }>();

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

  function handleDialogClose() {
    if (showModal) {
        showModal = false;
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (event.target === dialogElement) {
      closeModal();
    }
  }

  function closeModal() {
    showModal = false;
  }

  function getAvailableComponents(element: any): string[] {
    let allComponents = getAvailableComponentsForType(element.type);
    const currentComponents = element.data.components;
    let availableComponents = allComponents.filter(allComp => {
        return !currentComponents.some((currentComp: string) => currentComp === allComp);
    });

    return availableComponents;
  }
</script>

<dialog
  bind:this={dialogElement}
  class="modal"
  onclose={handleDialogClose}
  onclick={handleClickOutside}
>
  <div class="modal-box w-11/12 max-w-5xl">
    <h3 class="font-bold text-lg text-center">Add Component</h3>
    <div class="py-4">
      {#if element}
        <div class="grid grid-cols-fill-180 grid-cols-4 gap-4 p-4">
            {#each getAvailableComponents(element) as component}
                <div class="card bg-base-200 shadow-sm hover:bg-base-300 transition-colors cursor-pointer">
                    <div class="card-body p-4" onclick={() => addComponent(element.id, component)}>
                        <h4 class="text-m font-bold mb-1 truncate text-center">{component}</h4>
                        <h4 class="text-sm opacity-70 text-center">Field count: {getNumberOfFieldsOnComponent(element.type, component)}</h4>
                    </div>
                </div>
            {/each}
        </div>
      {:else}
        <p class="text-gray-500 italic">No element selected or loaded.</p>
      {/if}
    </div>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn" onclick={closeModal}>Close</button>
      </form>
    </div>
  </div>
</dialog>