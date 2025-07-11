<script lang="ts">
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
</script>

<dialog
  bind:this={dialogElement}
  class="modal"
  onclose={handleDialogClose}
  onclick={handleClickOutside}
>
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
        <button class="btn" onclick={closeModal}>Close</button>
      </form>
    </div>
  </div>
</dialog>