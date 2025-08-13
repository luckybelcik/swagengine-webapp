<script lang="ts">
    import type { Element, Schema } from "$lib/data/_definitions";

  let { showModal = $bindable(), element, schema } = $props<{
    showModal: boolean;
    element: Element;
    schema: Schema;
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
    <div>
      {#if element}
        <div class="absolute font-bold p-3 right-8 text-5xl opacity-30 select-none">Element Data</div>
        <pre class="bg-base-300 p-3 rounded-md overflow-auto text-sm text-base-content max-h-150">{JSON.stringify(element, null, 2).trim()}</pre>
      {:else}
        <p class="text-gray-500 italic">No element selected or loaded.</p>
      {/if}

      <div class="divider"></div>

      {#if schema}
        <div class="absolute font-bold p-3 right-8 text-5xl opacity-30 select-none">Schema</div>
        <pre class="bg-base-300 p-3 rounded-md overflow-auto text-sm text-base-content max-h-150">{JSON.stringify(schema, null, 2).trim()}</pre>
      {:else}
        <p class="text-gray-500 italic">No schema loaded.</p>
      {/if}
    </div>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn" onclick={closeModal}>Close</button>
      </form>
    </div>
  </div>
</dialog>