<script lang="ts">
  import { openElementTab } from "$lib/stores/editorTabsStore";
  import { userPreferenceStore } from "$lib/stores/userPreferenceStore";
  import { type Element } from "$lib/data/_definitions";
  import type { Snippet } from "svelte";

  let { element, children } = $props<{element: Element, children: Snippet}>();

  const coloredElementCards = $derived(() => $userPreferenceStore.preferences.coloredElementCards);

  function demoOpenElement(id: string, name: string) {
    openElementTab(id, name);
  }

  const overlayColor = $derived(() =>
    {
      if (coloredElementCards()) {
      switch (element.type) {
        case "item":
          return 'bg-amber-500';
        case "entity":
          return 'bg-lime-500';
        case "tile":
          return 'bg-emerald-500';
        case "command":
          return 'bg-blue-600';
        case "boss":
          return 'bg-red-600';
      }
    }

    return 'bg-neutral-100'
    }
  );
</script>

<button
  class="card bg-base-200 shadow-sm hover:bg-base-300 transition-colors cursor-pointer"
  aria-label="element_card"
  onclick={() => demoOpenElement(element.id, element.name)}
>
  <div
    class="card colored-card-background absolute inset-0 w-full h-full z-10 opacity-80 mix-blend-color {overlayColor()}"
  ></div>

  <div
    class="card grayscale-card-background absolute inset-0 w-full h-full z-10 opacity-80 mix-blend-color bg-neutral-100"
  ></div>

  <div class="relative z-20 w-full h-full">
    {@render children()}
  </div>
</button>