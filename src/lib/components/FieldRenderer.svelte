<script lang="ts">
  export let field;
  export let value: any;
  export let onChange: (name: string, value: any) => void;
  export let getEnumValues: (type: string) => string[];
</script>

<div class="field flex items-center">
  <label class="bg-base-200 text-base-content px-4 py-2 rounded-lg font-bold w-1/3 shrink-0" for={field.name}>
    {field.name}
  </label>

  {#if field.type === "integer"}
    <input type="number" step="1" bind:value on:input={() => onChange(field.name, parseInt(value, 10))} class="input input-bordered w-full" />

  {:else if field.type === "float"}
    <input type="number" step="any" bind:value on:input={() => onChange(field.name, parseFloat(value))} class="input input-bordered w-full" />

  {:else if field.type === "boolean"}
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
