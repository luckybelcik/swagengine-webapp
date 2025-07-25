<script lang="ts">
  import { COMPONENT_ICONS, COMPONENTS_WITH_ICONS, type ComponentWithIcon, type Element } from "$lib/stores/engineStore";
  import { userPreferenceStore } from "$lib/stores/userPreferenceStore";

  let { element } = $props<{ element: Element }>();

  const allowedComponentsSet = new Set<ComponentWithIcon>(COMPONENTS_WITH_ICONS);

  const isDarkMode = $derived(() => $userPreferenceStore.preferences[0].isDarkMode);

  const iconOpacity = $derived(() => isDarkMode() ? "bg-[rgba(0,0,0,0.5)]" : "bg-[rgba(255,255,255,0.5)]");

  const componentsWithIcons = $derived(() => {
    return element.data.components.filter((str: string): str is ComponentWithIcon => {
      return allowedComponentsSet.has(str as ComponentWithIcon);
    });
  })

  const componentWithoutIconsCount = $derived(() => {
    return element.data.components.length - componentsWithIcons().length;
  })
</script>

<div class="grid grid-cols-7 gap-0.5">
  {#each componentsWithIcons() as component}
    <div class="btn btn-square btn-xs {iconOpacity()}">
      <svg class="h-5">
        {@html COMPONENT_ICONS[component as ComponentWithIcon]}
      </svg>
    </div>
  {/each}
  {#if componentWithoutIconsCount() > 0}
    <div class="btn btn-square btn-xs {iconOpacity()}">
        {element.data.components.length - componentsWithIcons().length}+
    </div>
  {/if}
</div>