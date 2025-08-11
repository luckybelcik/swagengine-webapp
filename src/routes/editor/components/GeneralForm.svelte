<script lang="ts">
  import type { Snippet } from "svelte";

  let { formName, children } = $props<{formName: string, children: Snippet}>();
</script>

<div class="collapse collapse-arrow">
  <input type="checkbox" class="collapse-toggle"/>
  <div class="collapse-title">
    <div class="text-2xl font-bold w-full">{formName}</div>
  </div>
  <div class="collapse-content flex flex-col gap-2">
    {@render children()}
  </div>
</div>