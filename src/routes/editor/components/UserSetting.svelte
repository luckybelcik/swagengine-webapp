<script lang="ts">
    import { getPreference, updatePreference } from "$lib/stores/userPreferenceStore";
    import { toCamelCase, toSnakeCase } from "$lib/../routes/editor/utils/util"

  let { labelText, updateFunction, maxRange, minRange, settingType } = $props<{labelText: string, updateFunction: Function | string, maxRange?: number, minRange?: number, settingType: string}>();

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

  let computedUpdateFunction: Function;

  if (typeof updateFunction === 'function') {
    computedUpdateFunction = updateFunction;
  } else {
    let eventValueToCheck;
    if (settingType == "toggle") {
      eventValueToCheck = (event: any) => event.target.checked;
    } else {
      eventValueToCheck = (event: any) => event.target.value;
    }
    computedUpdateFunction = (event: any) => updatePreference(toCamelCase(labelText), eventValueToCheck(event));
  }

  const camelCaseLabel = toCamelCase(labelText);
</script>

<div>
  {#if settingType == "slider"}
  <div class="label">
    <span class="label-text">{labelText}</span>
  </div>
  <input class="ml-3 range range-primary w-40" type="range" min={computedMinRange} max={computedMaxRange} value={getPreference(camelCaseLabel)} onchange={(event: any) => computedUpdateFunction(event)} />
  
  {:else if settingType == "toggle"}
  <div class="label">
    <span class="label-text">{labelText}</span>
  </div>
  <input class="ml-3 toggle toggle-primary" type="checkbox" checked={getPreference(camelCaseLabel)} onchange={(event: any) => computedUpdateFunction(event)} />
  
  {:else if settingType == "string"}
  <div class="label">
    <span class="label-text">{labelText}</span>
  </div>
  <input class="ml-3 input input-primary" type="text" value={getPreference(camelCaseLabel)} onchange={(event: any) => computedUpdateFunction(event)} />
  
  {:else}
  <div>
    No setting type provided.
  </div>
  {/if}
</div>