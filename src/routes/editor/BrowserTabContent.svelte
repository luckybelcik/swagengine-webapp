<script lang="ts">
  import { engineStore } from '$lib/stores/engineStore';
  import { userPreferenceStore } from '$lib/stores/userPreferenceStore';
  import CardBackground from './components/CardBackground.svelte';
  import CommonComponentIcons from './components/CommonComponentIcons.svelte';
  import SearchBar from './components/SearchBar.svelte';
  import TypeIcon from './components/TypeIcon.svelte';

  const showComponentIcons = $derived(() => $userPreferenceStore.preferences.showComponentIcons);
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
        <CardBackground {element}>
          <div class="card-body p-2">
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-7 overflow-hidden">
              <TypeIcon elementType={element.type} />
            </div>

            <h4 class="text-lg font-bold mb-1 truncate text-center mt-2">{element.name}</h4>
            <p class="text-sm opacity-70">Type: {element.type}</p>
            <p class="text-xs opacity-50">ID: {element.id}</p>

            {#if showComponentIcons()}
              <div style="bottom: 0;">
                <CommonComponentIcons {element} />
              </div>
            {/if}
          </div>
        </CardBackground>
      {/each}
    </div>
  {:else}
    <p class="text-gray-500">No elements available.</p>
  {/if}
</div>