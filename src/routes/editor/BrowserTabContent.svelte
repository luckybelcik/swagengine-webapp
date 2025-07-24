<script lang="ts">
  import { openElementTab } from '$lib/stores/editorTabsStore';
  import { engineStore } from '$lib/stores/engineStore';
  import SearchBar from './components/SearchBar.svelte';
    import TypeIcon from './components/TypeIcon.svelte';

  function demoOpenElement(id: string, name: string) {
    openElementTab(id, name);
  }
</script>

<div id="tab-content-browser" role="tabpanel" aria-labelledby="tab-header-browser" class="ml-4 mt-2">
  <h2 class="text-3xl font-bold mb-4">Element Browser</h2>

  <div class="mb-6 mt-6 gap-2 flex flex-col">
    <p class="text-xl">Search Elements</p>
    <SearchBar />
  </div>

  <h3 class="text-xl font-semibold mb-5">Existing Elements (Click to open tab)</h3>
  {#if $engineStore.elements && $engineStore.elements.length > 0}
    <div class="grid grid-cols-fill-180 grid-cols-5 gap-4">
      {#each $engineStore.elements as element (element.id)}
        <button
          class="card bg-base-200 shadow-sm hover:bg-base-300 transition-colors cursor-pointer"
          on:click={() => demoOpenElement(element.id, element.name)}
        >
          <div class="card-body p-4 overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-7 overflow-hidden">
              <TypeIcon elementType={element.type} />
            </div>

            <h4 class="text-lg font-bold mb-1 truncate text-center">{element.name}</h4>
            <p class="text-sm opacity-70">Type: {element.type}</p>
            <p class="text-xs opacity-50">ID: {element.id}</p>
          </div>
        </button>
      {/each}
    </div>
  {:else}
    <p class="text-gray-500">No elements available.</p>
  {/if}
</div>