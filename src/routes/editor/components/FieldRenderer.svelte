<script lang="ts">
  let { field, value, onChange, getEnumValues } = $props<{ field: any, value: any, onChange: (name: string, value: any) => void, getEnumValues: (type: string) => string[]}>();

  function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  const clampBigInt = (value: bigint, min: bigint, max: bigint): bigint => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  };

  const INT64_MIN = -9223372036854775808n;
  const INT64_MAX = 9223372036854775807n;
  const UINT64_MIN = 0n;
  const UINT64_MAX = 18446744073709551615n;

  const typeConfigs = {
    u_int_8:  { min: 0, max: 255 },
    u_int_16: { min: 0, max: 65535 },
    u_int_32: { min: 0, max: 4294967295 },
    int_8:    { min: -128, max: 127 },
    int_16:   { min: -32768, max: 32767 },
    int_32:   { min: -2147483648, max: 2147483647 },
    percent:  { min: 0, max: 100 },
  };

  const isBigInt = (type: string) => type === 'int_64' || type === 'u_int_64';
  const isClamped = (type: string) => type in typeConfigs;
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

  const handleNan = (value: any): string => {
    if (value == undefined || Number.isNaN(value)) {
      return "0";
    } else {
      return value.toString();
    }
  }

</script>

<div class="field flex items-center">
  <label class="bg-base-200 text-base-content px-4 py-2 input mr-3 input-disabled font-bold w-1/5 shrink-0" for={field.name}>
    {field.name}
    <div class="opacity-60 font-normal text-xs">({field.type})</div>
  </label>

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
  <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0">True value: {handleBigInt(value)}</div>

{:else if isClamped(field.type)}
  <input type="number" step="1" bind:value oninput={() =>
      onChange(field.name, clamp(parseInt(value, 10), typeConfigs[field.type].min, typeConfigs[field.type].max))}
    class="input input-bordered w-2/5"
  />
  <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0">
    True value: {handleNan(clamp(parseInt(value, 10), typeConfigs[field.type].min, typeConfigs[field.type].max))}
  </div>

{:else if isFloat(field.type)}
  <input type="number" step="0.1" bind:value oninput={() => onChange(field.name, parseFloat(value))}
    class="input input-bordered w-2/5"
  />
  <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0">
    True value: {handleNan(parseFloat(value))}
  </div>

{:else}
  <input type="text" bind:value oninput={() => onChange(field.name, value)} class="input input-bordered w-full" />
{/if}
</div>
