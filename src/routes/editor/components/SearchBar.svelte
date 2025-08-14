<script lang="ts">
  import { writable, derived } from 'svelte/store';
  import { engineStore, getElementProperty } from '$lib/stores/engineStore';
  import { openElementTab } from '$lib/stores/editorTabsStore';

  const searchQuery = writable('');

  function focusInput(node: HTMLInputElement) {
    node.focus();
  }

  const filteredElements = derived([searchQuery, engineStore], ([$searchQuery, $engineStore]) => {
    const query = $searchQuery.toLowerCase().trim();
    if (!query) {
      return [];
    }

    const results = $engineStore.loadedElements.filter(element =>
      element.id.toLowerCase().includes(query)
    );

    results.sort((a, b) => a.id.localeCompare(b.id));

    return results.slice(0, 15);
  });

  let showResults = false;
  let searchInput: HTMLInputElement;

  function selectResult(id: string) {
    $searchQuery = id;
    showResults = false
    searchInput.focus()
    openElementTab(id, getElementProperty(id, "name") as string);
  }

  function handleFocus() {
    if ($searchQuery.trim().length > 0) {
      showResults = true;
    }
  }

  function handleBlur() {
    setTimeout(() => {
      showResults = false;
    }, 100);
  }

  $: {
    if ($searchQuery.trim().length > 0) {
      if (document.activeElement === searchInput) {
        showResults = true;
      }
    } else {
      showResults = false;
    }
  }

  function highlightMatch(text: string, query: string): string {
    if (!query) return text;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const startIndex = lowerText.indexOf(lowerQuery);

    if (startIndex === -1) {
      return text;
    }

    const endIndex = startIndex + query.length;
    return (
      text.substring(0, startIndex) +
      `<span class="font-bold text-primary">${text.substring(startIndex, endIndex)}</span>` +
      text.substring(endIndex)
    );
  }
</script>

<div class="relative w-full max-w-sm">
  <input
    type="text"
    placeholder="Search elements by ID..."
    class="input input-bordered w-full"
    bind:value={$searchQuery}
    on:focus={handleFocus}
    on:blur={handleBlur}
    bind:this={searchInput}
    use:focusInput
  />

  {#if showResults && $filteredElements.length > 0}
    <ul class="absolute z-10 w-full bg-base-100 shadow-lg rounded-box mt-2 py-2 max-h-60 overflow-y-auto">
      {#each $filteredElements as element (element.id)}
        <li>
          <button
            class="w-full px-4 py-2 hover:bg-base-200 cursor-pointer"
            on:mousedown|preventDefault={() => selectResult(element.id)}
            >
            {@html highlightMatch(element.id, $searchQuery)}
        </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>