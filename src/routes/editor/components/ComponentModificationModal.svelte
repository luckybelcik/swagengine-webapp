<script lang="ts">
    import { getComponentsForType, getNumberOfFieldsOnComponent } from "$lib/data/_definitions";
    import { activeTabId, reloadTab } from "$lib/stores/editorTabsStore";
    import { addComponent, engineStore, hasComponent, removeComponent, type Element } from "$lib/stores/engineStore";
    import { get } from "svelte/store";
    import { swapBackRemove } from "../utils/swapbackArray";
    
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

  function handleAddComponent(component_name: string) {
    const element = activeElement();
    if (element){
      const id = element.id;
      if (!hasComponent(id, component_name)) {
        console.log("Adding component", component_name, "to", {id})
        addComponent(id, component_name);
      } else {
        console.log("Adding component", component_name, "to", {id}, "failed")
      }
    }
  }

  function handleDeleteComponent(component_name: string) {
    const element = activeElement();
    if (element && hasComponent(element.id, component_name)) {
      removeComponent(element.id, component_name);
    }
  }

  function getAvailableComponents(): string[] {
    if (activeElement() && activeElement()?.data.components) {
      const currentComponents = activeElement()?.data.components;
      const allComponents = getComponentsForType(activeElement().type);
      let availableComponents;
      if (allComponents.length > 0) {
        if (currentComponents && currentComponents.length > 0) {
          availableComponents = allComponents.filter(allComp => {
              return !currentComponents.some((currentComp: string) => currentComp === allComp);
          });
        } else {
          return allComponents;
        }
      } else {
        return ["none"];
      }

      return availableComponents;
    }

    return ["none"];
  }

  function shouldHighlight(component_name: string): boolean {
    const availableComponents = getAvailableComponents()

    if (availableComponents.length == 1 && availableComponents[0] == "none") {
      return false;
    }

    const index = availableComponents.indexOf(component_name);
    
    if (index == -1) {
      return true;
    }

    return false;
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
      {#if activeElement()}
        <div class="grid grid-cols-fill-180 grid-cols-4 gap-4 p-4">
          {#if getComponentsForType(activeElement().type) && getComponentsForType(activeElement().type).length > 0}
            {#each getComponentsForType(activeElement().type) as componentName}
              <div 
              class="card bg-base-200 opacity-40 shadow-sm hover:opacity-70 transition-opacity group"
              class:opacity-100={shouldHighlight(componentName)}
              class:bg-base-100={shouldHighlight(componentName)}
              class:hover:opacity-100={shouldHighlight(componentName)}>
                <button class="card-body p-4"
                  class:hover:cursor-pointer={!shouldHighlight(componentName)}
                  onclick={() => handleAddComponent(componentName)}>
                  <h4 class="text-m font-bold mb-1 truncate text-center">{componentName}</h4>
                  <h4 class="text-sm opacity-70 text-center">Field count: {getNumberOfFieldsOnComponent(activeElement().type, componentName)}</h4>
                </button>
                <button
                  class="btn btn-circle btn-error btn-xs absolute top-0 right-0 m-1 opacity-0 transition-opacity duration-200"
                  class:group-hover:opacity-100={shouldHighlight(componentName)}
                  aria-label="delete"
                  onclick={() => handleDeleteComponent(componentName)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            {/each}
          {:else}
            <p>No components found :C</p>
          {/if}  
        </div>
      {:else}
        <p class="text-gray-500 italic">No element selected or loaded.</p>
      {/if}
    </div>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-success" onclick={closeModal}>Save</button>
      </form>
    </div>
  </div>
</dialog>