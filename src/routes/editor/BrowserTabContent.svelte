<script>
    import { openElementTab } from '$lib/stores/editorTabsStore';
    import { engineStore } from '$lib/stores/engineStore'; // Import createNewBlankElement

    // (Keep your existing demoOpenElement function if you want to keep the list below)
    /**
     * @param {string} id
     * @param {string} name
     */
    function demoOpenElement(id, name) {
        openElementTab(id, name);
    }
</script>

<div id="tab-content-browser" role="tabpanel" aria-labelledby="tab-header-browser">
    <h2 class="text-3xl font-bold mb-4">Element Browser</h2>
    <p class="text-lg mb-4">Search for elements or add new ones here.</p>
    <p class="opacity-60">Search Elements</p>
    <input type="text" placeholder="Search by name..." class="input input-bordered mb-8" />
    <h3 class="text-xl font-semibold mb-5">Existing Elements (Click to open tab)</h3>
    {#if $engineStore.elements && $engineStore.elements.length > 0}
        <div class="grid grid-cols-fill-180 grid-cols-5 gap-4">
            {#each $engineStore.elements as element (element.id)}
                <button
                    class="card bg-base-200 shadow-sm hover:bg-base-300 transition-colors cursor-pointer"
                    on:click={() => demoOpenElement(element.id, element.name)}
                >
                    <div class="card-body p-4">
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