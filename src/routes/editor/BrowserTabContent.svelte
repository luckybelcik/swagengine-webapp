<script lang="ts">
    import { TYPE_ICON_SVGS } from '$lib/data/_constant_data';
  import { engineStore } from '$lib/stores/engineStore';
  import { userPreferenceStore } from '$lib/stores/userPreferenceStore';
  import CardBackground from './components/CardBackground.svelte';
  import CommonComponentIcons from './components/CommonComponentIcons.svelte';
  import SearchBar from './components/SearchBar.svelte';
  import TypeIcon from './components/TypeIcon.svelte';
</script>

<div id="tab-content-browser" role="tabpanel" aria-labelledby="tab-header-browser" class="ml-4 mt-2">
  <h2 class="text-3xl font-bold mb-4">Element Browser</h2>

  <div class="mb-6 mt-6 gap-2 flex flex-col">
    <p class="text-xl">Search Elements</p>
    <SearchBar />
  </div>

  <h3 class="text-xl font-semibold mb-5">Existing Elements (Click to open tab)</h3>
  {#if $engineStore.loadedElements && $engineStore.loadedElements.length > 0}
    <div class="grid grid-cols-fill-180 grid-cols-5 gap-4">
      {#each $engineStore.loadedElements as element (element.id)}
        <CardBackground {element}>
          <div class="card-body p-2">
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-7 overflow-hidden">
              <TypeIcon elementType={element.type as keyof typeof TYPE_ICON_SVGS} />
            </div>

            <h4 class="text-lg font-bold mb-1 truncate text-center mt-2">{element.name}</h4>
            <p class="text-sm opacity-70">Type: {element.type}</p>
            <p class="text-xs opacity-50">ID: {element.id}</p>

            <div style="bottom: 0;" class="common-component-icons">
              <CommonComponentIcons {element} />
            </div>
          </div>
        </CardBackground>
      {/each}
    </div>
  {:else}
    <p class="text-gray-500">No elements available.</p>
  {/if}
</div>