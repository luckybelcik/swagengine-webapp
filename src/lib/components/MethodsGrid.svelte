<script lang="ts">
  export let methods;
</script>

<div class="grid grid-cols-fill-180 grid-cols-7 gap-4 p-4">
  {#each methods as method (method)}
    <button
      class="card bg-base-200 shadow-sm hover:bg-base-300 transition-colors cursor-pointer"
    >
      <div class="card-body p-4">
        <h4 class="text-lg font-bold mb-1 truncate text-center">{method.type}</h4>
        <p class="text-sm opacity-70">Length: {method.code.length}</p>
        </div>
    </button>
  {/each}
</div>