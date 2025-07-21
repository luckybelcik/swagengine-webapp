<script lang="ts">
  export let field;
  export let value: any;
  export let onChange: (name: string, value: any) => void;
  export let getEnumValues: (type: string) => string[];

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

  {#if field.type === "u_int_8"}
    <input type="number" step="1" bind:value on:input={() => onChange(field.name, clamp(parseInt(value, 10), 0, 255))} class="input input-bordered w-2/5" />
    <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0">Corrected value: {handleNan(clamp(parseInt(value, 10), 0, 255))}</div>

  {:else if field.type === "u_int_16"}
    <input type="number" step="1" bind:value on:input={() => onChange(field.name, clamp(parseInt(value, 10), 0, 65535))} class="input input-bordered w-2/5" />
    <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0">Corrected value: {handleNan(clamp(parseInt(value, 10), 0, 65535))}</div>

  {:else if field.type === "u_int_32"}
    <input type="number" step="1" bind:value on:input={() => onChange(field.name, clamp(parseInt(value, 10), 0, 4294967295))} class="input input-bordered w-2/5" />
    <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0">Corrected value: {handleNan(clamp(parseInt(value, 10), 0, 4294967295))}</div>

  {:else if field.type === "u_int_64"}
    <input type="text" step="1" bind:value on:input={() => onChange(field.name, handleBigInt(value))} class="input input-bordered w-2/5" />
    <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0">Corrected value: {handleBigInt(value)}</div>

  {:else if field.type === "int_8"}
    <input type="number" step="1" bind:value on:input={() => onChange(field.name, clamp(parseInt(value, 10), -128, 127))} class="input input-bordered w-2/5" />
    <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0">Corrected value: {handleNan(clamp(parseInt(value, 10), -128, 127))}</div>

  {:else if field.type === "int_16"}
    <input type="number" step="1" bind:value on:input={() => onChange(field.name, clamp(parseInt(value, 10), -32768, 32767))} class="input input-bordered w-2/5" />
    <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0">Corrected value: {handleNan(clamp(parseInt(value, 10), -32768, 32767))}</div>

  {:else if field.type === "int_32"}
    <input type="number" step="1" bind:value on:input={() => onChange(field.name, clamp(parseInt(value, 10), -2147483648, 2147483647))} class="input input-bordered w-2/5" />
    <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0">Corrected value: {handleNan(clamp(parseInt(value, 10), -2147483648, 2147483647))}</div>

  {:else if field.type === "int_64"}
    <input type="text" step="1" bind:value on:input={() => onChange(field.name, handleBigInt(value))} class="input input-bordered w-2/5" />
    <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0">Corrected value: {handleBigInt(value)}</div>

  {:else if field.type === "percent"}
    <input type="number" step="1" bind:value on:input={() => onChange(field.name, clamp(parseInt(value, 10), 0, 100))} class="input input-bordered w-2/5" />
    <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0">Corrected value: {handleNan(clamp(parseInt(value, 10), 0, 100))}</div>

  {:else if field.type === "float"}
    <input type="number" step="0.1" bind:value on:input={() => onChange(field.name, parseFloat(value))} class="input input-bordered w-2/5" />
    <div class="bg-base-200 ml-3 px-4 py-2 mr-3 input input-disabled w-2/5 shrink-0">Corrected value: {handleNan(parseFloat(value))}</div>

  {:else if field.type === "bool"}
    <input type="checkbox" checked={value} on:change={() => onChange(field.name, !value)} class="toggle toggle-primary" />

  {:else if getEnumValues(field.type).length}
    <select bind:value on:change={() => onChange(field.name, value)} class="select select-bordered w-full">
      <option disabled selected value="">-- Select {field.type} --</option>
      {#each getEnumValues(field.type) as opt}
        <option value={opt}>{opt}</option>
      {/each}
    </select>

  {:else}
    <input type="text" bind:value on:input={() => onChange(field.name, value)} class="input input-bordered w-full" />
  {/if}
</div>
