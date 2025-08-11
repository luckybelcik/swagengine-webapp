<script lang="ts">
  import { NUMBER_TYPE_CONFIGS, INT64_MAX, INT64_MIN, UINT64_MAX, UINT64_MIN, BIT_32_FLOAT_MAX, BIT_32_FLOAT_MIN } from "$lib/data/_constant_data.js" 
    import type { NumberType } from "$lib/data/_definitions";
    import { clamp, clampBigInt, clampTo32BitFloat, handleNan, snakeCaseToCapitalized } from "$lib/../routes/editor/utils/util";
    import Tooltip from "../components/Tooltip.svelte"
  let { field, value, onChange, getEnumValues } = $props<{ field: any, value: any, onChange: (name: string, value: any) => void, getEnumValues: (type: string) => string[]}>();

  const fieldTypeAsString: string = field.type;

  const fieldType: NumberType = Object.keys(NUMBER_TYPE_CONFIGS).includes(fieldTypeAsString)
  ? (fieldTypeAsString as NumberType)
  : "u_int_8";

  let tooltipTrigger: HTMLElement | undefined = $state();
  let isHovered: boolean = $state(false);

  const isBigInt = (type: string) => type === 'int_64' || type === 'u_int_64';
  const isClamped = (type: string) => type in NUMBER_TYPE_CONFIGS;
  const isFloat = (type: string) => type === 'float';
  const isBool = (type: string) => type === 'bool';
  const isEnum = (type: string) => getEnumValues(type).length > 0;

  const handleBigInt = (value: string): string => {
    const inputValue = value;

    if (inputValue == undefined) {
      return "0";
    }

    const cleanedValue = inputValue.replace(/[^0-9-]/g, '');
    const isNegative = cleanedValue.startsWith('-');
    const digitsOnly = isNegative ? cleanedValue.substring(1) : cleanedValue;

    if (digitsOnly === '' && !isNegative) {
        onChange(field.name, null);
        return "0";
    }

    let tempBigInt = BigInt(cleanedValue);

    if (field.type === "int_64") {
      return clampBigInt(tempBigInt, INT64_MIN, INT64_MAX).toString();
    } else if (field.type === "u_int_64") {
      return clampBigInt(tempBigInt, UINT64_MIN, UINT64_MAX).toString();
    }

    return "0";
  }
</script>

<div class="field flex items-center">
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="relative group w-1/5 mr-3" bind:this={tooltipTrigger} onmouseenter={() => (isHovered = true)} onmouseleave={() => (isHovered = false)}>
    <label class="bg-base-200 text-base-content px-4 py-2 input input-disabled font-bold shrink-0" for={field.name}>
      {field.name}
      <div class="opacity-60 font-normal text-xs">({field.type})</div>
    </label>

    {#if isHovered}
      <Tooltip header={snakeCaseToCapitalized(field.name)} 
        description={field.description}
        warning={field.warning}
        higlightedInfo={field.info}
        triggerNode={tooltipTrigger}/>
    {/if}
  </div>

  {#if isBool(field.type)}
  <input type="checkbox" checked={value} onchange={() => onChange(field.name, !value)} class="toggle toggle-primary" />

{:else if isEnum(field.type)}
  <select bind:value onchange={() => onChange(field.name, value)} class="select select-bordered w-full">
    <option disabled selected value="">-- Select {field.type} --</option>
    {#each getEnumValues(field.type) as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </select>

{:else if isBigInt(field.type)}
  <input type="text" bind:value oninput={() => onChange(field.name, handleBigInt(value))} class="input input-bordered w-2/5" />
  <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0 hover-children-visible">
    <div class="visible">
      True value: {handleBigInt(value)}
    </div>

    <div class="hidden">
      {#if field.type == "u_int_64"}
        Max: {UINT64_MAX}, Min: {UINT64_MIN}
      {:else}
        Max: {INT64_MAX}, Min: {INT64_MIN}
      {/if}
    </div>
  </div>

{:else if isClamped(field.type)}
  <input type="number" step="1" bind:value oninput={() =>
      onChange(field.name, clamp(parseInt(value, 10), NUMBER_TYPE_CONFIGS[fieldType].min, NUMBER_TYPE_CONFIGS[fieldType].max))}
    class="input input-bordered w-2/5"
  />
  <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0 hover-children-visible">
    <div class="visible">
      True value: {handleNan(clamp(parseInt(value, 10), NUMBER_TYPE_CONFIGS[fieldType].min, NUMBER_TYPE_CONFIGS[fieldType].max))}
    </div>

    <div class="hidden">
      Max: {NUMBER_TYPE_CONFIGS[fieldType].max}, Min: {NUMBER_TYPE_CONFIGS[fieldType].min}
    </div>
  </div>

{:else if isFloat(field.type)}
  <input type="number" step="0.1" bind:value oninput={() => onChange(field.name, parseFloat(value))}
    class="input input-bordered w-2/5"
  />
  <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0 hover-children-visible">
    <div class="visible">
      True value: {handleNan(clampTo32BitFloat(parseFloat(value)))}
    </div>

    <div class="hidden">
      Max: {BIT_32_FLOAT_MAX}, Min: {BIT_32_FLOAT_MIN}
    </div>
  </div>

{:else}
  <input type="text" bind:value oninput={() => onChange(field.name, value)} class="input input-bordered w-full" />
{/if}
</div>