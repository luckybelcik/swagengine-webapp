<script>
    let { children } = $props();
    import { page } from '$app/stores';
    import "../app.css";
    import Footer from "../lib/components/Footer.svelte";
    import DropdownMenu from "../lib/components/DropdownMenu.svelte";
</script>

<div>
  <div class="fixed right-0 top-0">
    <DropdownMenu />
  </div>

  <main class="flex-grow min-h-screen">
    {@render children()}
  </main>

  {#if !$page.url.pathname.startsWith('/editor')}
    <Footer />
  {/if}
</div>

