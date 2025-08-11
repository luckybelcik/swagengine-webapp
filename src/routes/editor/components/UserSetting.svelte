<script lang="ts">
    import { getImageProperty, getPreference, updateImageProperty, updatePreference } from "$lib/stores/userPreferenceStore";
    import { toCamelCase, toSnakeCase } from "$lib/../routes/editor/utils/util"

  let { labelText, updateFunctionOrProperty, maxRange, minRange, settingType, imageToUpdate } = $props<{labelText: string, updateFunctionOrProperty: Function | string, maxRange?: number, minRange?: number, settingType: string, imageToUpdate?: string}>();

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
  let initialValue: any = $state(null);
  const propertyName = toCamelCase(labelText);

  if (typeof updateFunctionOrProperty === 'function') {
    computedUpdateFunction = updateFunctionOrProperty;
  } else {
    let eventValueToCheck;
    if (settingType == "toggle") {
      eventValueToCheck = (event: any) => event.target.checked;
    } else {
      eventValueToCheck = (event: any) => event.target.value;
    }

    if (imageToUpdate == undefined) {
      computedUpdateFunction = (event: any) => updatePreference(propertyName, eventValueToCheck(event));
      initialValue = getPreference(propertyName)
    } else {
      computedUpdateFunction = (event: any) => updateImageProperty(imageToUpdate, updateFunctionOrProperty, eventValueToCheck(event));
      initialValue = getImageProperty(imageToUpdate, updateFunctionOrProperty)
    }
  }
</script>

<div>
  {#if settingType == "slider"}
  <div class="label">
    <span class="label-text">{labelText}</span>
  </div>
  <input class="ml-3 range range-primary w-40" type="range" min={computedMinRange} max={computedMaxRange} value={initialValue} onchange={(event: any) => computedUpdateFunction(event)} />
  
  {:else if settingType == "toggle"}
  <div class="label">
    <span class="label-text">{labelText}</span>
  </div>
  <input class="ml-3 toggle toggle-primary" type="checkbox" checked={initialValue} onchange={(event: any) => computedUpdateFunction(event)} />
  
  {:else if settingType == "string"}
  <div class="label">
    <span class="label-text">{labelText}</span>
  </div>
  <input class="ml-3 input input-primary" type="text" value={initialValue} onchange={(event: any) => computedUpdateFunction(event)} />
  
  {:else}
  <div>
    No setting type provided.
  </div>
  {/if}
</div>