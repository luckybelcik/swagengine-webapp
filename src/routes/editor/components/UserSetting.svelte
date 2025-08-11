<script lang="ts">
    import { getPreference } from "$lib/stores/userPreferenceStore";
    import { toCamelCase } from "$lib/../routes/editor/utils/util"

  let { labelText, updateFunction, maxRange, minRange, settingType } = $props<{labelText: string, updateFunction: Function, maxRange?: number, minRange?: number, settingType: string}>();

  let computedMaxRange = $state(100);
  let computedMinRange = $state(0);

  $effect (() => {
    if (maxRange != undefined) {
      computedMaxRange = maxRange
    }

    if (minRange != undefined) {
      computedMinRange = minRange
    }
  })

  const camelCaseLabel = toCamelCase(labelText);
</script>

<div>
  {#if settingType == "slider"}
  <div class="label">
    <span class="label-text">{labelText}</span>
  </div>
  <input class="ml-3 range range-primary w-40" type="range" min={computedMinRange} max={computedMaxRange} value={getPreference(camelCaseLabel)} onchange={(event: any) => updateFunction(event)} />
  
  {:else if settingType == "toggle"}
  <div class="label">
    <span class="label-text">{labelText}</span>
  </div>
  <input class="ml-3 toggle toggle-primary" type="checkbox" checked={getPreference(camelCaseLabel)} onchange={(event: any) => updateFunction(event)} />
  
  {:else if settingType == "string"}
  <div class="label">
    <span class="label-text">{labelText}</span>
  </div>
  <input class="ml-3 input input-primary" type="text" value={getPreference(camelCaseLabel)} onchange={(event: any) => updateFunction(event)} />
  
  {:else}
  <div>
    No setting type provided.
  </div>
  {/if}
</div>