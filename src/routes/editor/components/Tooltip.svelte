<script lang="ts">
  import { portal } from '$lib/actions/portal';
    import { onMount } from 'svelte';

  let { header, description, warning, higlightedInfo, triggerNode } = $props<{header: string, description: string, warning?: string, higlightedInfo?: string, triggerNode: HTMLElement | undefined}>();

  let tooltipNode: HTMLElement;
  let position = { x: 0, y: 0 };

  function updatePosition() {
    if (!triggerNode || !tooltipNode) return;

    const triggerRect = triggerNode.getBoundingClientRect();
    const tooltipRect = tooltipNode.getBoundingClientRect();

    const top = triggerRect.top - tooltipRect.height - 8;
    const left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);

    tooltipNode.style.top = `${top}px`;
    tooltipNode.style.left = `${left}px`;
  }

  $effect(() => {
    updatePosition();
  })

  onMount(() => {
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    updatePosition();
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  });
</script>

<div use:portal bind:this={tooltipNode} class="fixed z-10 flex flex-col items-center w-60 p-4 pt-2 rounded-lg bg-base-300 shadow-lg">
  <div class="text-lg font-bold">{header}</div>

  {#if description}
  <div class="text-sm mt-2">{description}</div>
  {:else}
  <div class="text-sm mt-2">No description provided.</div>
  {/if}
  
  {#if higlightedInfo}
  <div class="text-cyan-500 text-xs opacity-70 mt-2">{higlightedInfo}</div>
  {/if}

  {#if warning}
  <div class="text-red-500 text-xs mt-2">WARNING: {warning}</div>
  {/if}

  <div class="absolute left-1/2 -translate-x-1/2 w-0 h-0 
  border-x-10 border-t-10 border-solid border-transparent 
  border-t-base-300 top-full"></div>
</div>