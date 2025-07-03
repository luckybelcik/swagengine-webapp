<script>
    let { children } = $props();
    import "../app.css";
    import Footer from "../lib/components/Footer.svelte";
    import DropdownMenu from "../lib/components/DropdownMenu.svelte";
</script>

<div>
  <div class="fixed right-5 top-5">
    <DropdownMenu />
  </div>

  <main class="flex-grow min-h-screen">
    {@render children()}
  </main>

  <Footer />
</div>

