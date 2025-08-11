<script lang="ts">
    import { getPreference } from "$lib/stores/userPreferenceStore";
    import { toCamelCase } from "$lib/../routes/editor/utils/util"

  let { labelText, updateFunction } = $props<{labelText: string, updateFunction: Function}>();

  const camelCaseLabel = toCamelCase(labelText);
</script>

<div>
  <div class="label">
    <span class="label-text">{labelText}</span>
  </div>
  <input class="ml-3 range range-primary w-40" type="range" min="0" max="100" value={getPreference(camelCaseLabel)} onchange={(event: any) => updateFunction(event)} />
</div>