<script lang="ts">
    import { type Element, getComponentsForType, getNumberOfFieldsOnComponent } from "$lib/data/_definitions";
  import { addComponent, hasComponent, removeComponent } from "$lib/stores/engineStore";
    import { debugLog } from "../utils/util";

  let { activeElement, componentName } = $props<{ activeElement: Element | undefined, componentName: string }>();

  function handleAddComponent(component_name: string) {
    if (activeElement){
      const id = activeElement.id;
      if (!hasComponent(id, component_name)) {
        debugLog("componentCard", "Adding component", component_name, "to", id)
        addComponent(id, component_name);
      } else {
        debugLog("componentCard", "Adding component", component_name, "to", id, "failed")
      }
    }
  }

  function handleDeleteComponent(component_name: string) {
    if (activeElement && hasComponent(activeElement.id, component_name)) {
      removeComponent(activeElement.id, component_name);
    }
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

  function getAvailableComponents(): string[] {
    if (activeElement && activeElement?.data.components) {
      const currentComponents = activeElement?.data.components;
      const allComponents = getComponentsForType(activeElement.type);
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
</script>

<div 
  class="card bg-base-200 opacity-40 shadow-sm hover:opacity-70 transition-opacity group"
  class:opacity-100={shouldHighlight(componentName)}
  class:bg-base-100={shouldHighlight(componentName)}
  class:hover:opacity-100={shouldHighlight(componentName)}>
  <button class="card-body p-4"
    class:hover:cursor-pointer={!shouldHighlight(componentName)}
    onclick={() => handleAddComponent(componentName)}>
    <h4 class="text-m font-bold mb-1 truncate text-center">{componentName}</h4>
    <h4 class="text-sm opacity-70 text-center">Field count: {getNumberOfFieldsOnComponent(activeElement.type, componentName)}</h4>
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