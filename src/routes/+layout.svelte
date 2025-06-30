<script>
    let { children } = $props();
    import "../app.css";
    import Footer from "../lib/components/Footer.svelte";
</script>

<div>
  <main class="flex-grow min-h-screen">
    {@render children()}
  </main>

  <Footer />
</div>

