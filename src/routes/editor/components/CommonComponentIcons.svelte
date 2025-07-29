<script lang="ts">
  import { type ComponentWithIcon, type Element } from "$lib/data/_definitions";
  import { COMPONENTS_WITH_ICONS, COMPONENT_ICONS } from "$lib/data/_constant_data"

  let { element } = $props<{ element: Element }>();

  const allowedComponentsSet = new Set<ComponentWithIcon>(COMPONENTS_WITH_ICONS);

  const componentsWithIcons = $derived(() => {
    if (element.data.components) {
      return element.data.components.filter((str: string): str is ComponentWithIcon => {
        return allowedComponentsSet.has(str as ComponentWithIcon);
      });
    }
  })

  const componentWithoutIconsCount = $derived(() => {
    if (element.data.components && componentsWithIcons()) {
      return element.data.components.length - componentsWithIcons().length;
    } else {
      return 0;
    }
  })
</script>

<div class="grid grid-cols-7 gap-0.5">
  {#each componentsWithIcons() as component}
    <div class="btn btn-square btn-xs component-icon">
      <svg class="h-5">
        {@html COMPONENT_ICONS[component as ComponentWithIcon]}
      </svg>
    </div>
  {/each}
  {#if componentWithoutIconsCount() > 0}
    <div class="btn btn-square btn-xs component-icon">
        {componentWithoutIconsCount()}+
    </div>
  {/if}
</div>