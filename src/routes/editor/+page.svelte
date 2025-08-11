<script>
  import { openTabs, activeTabId, setActiveTab, closeTab } from '$lib/stores/editorTabsStore';
  import BrowserTabContent from './BrowserTabContent.svelte';
  import ElementTabContent from './ElementTabContent.svelte';
</script>

<div class="flex flex-col h-full">
  <div role="tablist" class="tabs tabs-boxed overflow-x-auto flex-none bg-base-200">
    {#each $openTabs as tab (tab.id)}
      <button
        role="tab"
        class="tab {tab.id === $activeTabId ? 'tab-active' : ''}"
        on:click={() => setActiveTab(tab.id)}
        aria-selected={tab.id === $activeTabId}
        aria-controls={`tab-content-${tab.id}`}
        id={`tab-header-${tab.id}`}
      >
        {@html tab.icon}
        <span class="ml-2">{tab.name}</span>
        {#if tab.closable}
          <span
            class="btn btn-xs btn-ghost btn-square ml-2 inline-flex items-center justify-center cursor-pointer"
            role="button"
            tabindex="0"
            on:click|stopPropagation={() => closeTab(tab.id)}
            aria-label="Close {tab.name} tab"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </span>
        {/if}
      </button>
    {/each}
  </div>
  
  <div class="flex-grow overflow-y-auto p-4 bg-base-100 shadow-md">
    <div class="z-[10]">
      {#if $activeTabId === 'browser'}
        <BrowserTabContent />
      {:else}
        <ElementTabContent />
      {/if}
    </div>
  </div>
</div>