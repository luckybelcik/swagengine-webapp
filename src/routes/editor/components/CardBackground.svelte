<script lang="ts">
  import { openElementTab } from "$lib/stores/editorTabsStore";
  import { getPreference, userPreferenceStore } from "$lib/stores/userPreferenceStore";
  import { type Element } from "$lib/stores/engineStore";
  import type { Snippet } from "svelte";
    import Page from "../+page.svelte";

  let { element, children } = $props<{element: Element, children: Snippet}>();

  const coloredElementCards = $derived(() => $userPreferenceStore.preferences.coloredElementCards);
  const isDarkMode = $derived(() => $userPreferenceStore.preferences.isDarkMode);

  function demoOpenElement(id: string, name: string) {
    openElementTab(id, name);
  }

  const overlayColor = $derived(() =>
    {
      console.log("beep boop");
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
    class="card absolute inset-0 w-full h-full z-10 mix-blend-multiply transition-opacity duration-1000 ease-in-out {overlayColor()}"
    class:opacity-30={!isDarkMode()}
    class:opacity-0={isDarkMode()}
  ></div>

  <div
    class="card absolute inset-0 w-full h-full overflow-hidden z-10 mix-blend-multiply transition-opacity duration-1000 ease-in-out {overlayColor()}"
    class:opacity-80={isDarkMode()}
    class:opacity-0={!isDarkMode()}
  ></div>

  <div class="relative z-20 w-full h-full">
    {@render children()}
  </div>
</button>