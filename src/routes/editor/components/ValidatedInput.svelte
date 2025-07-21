<script lang="ts">
  import { onMount } from 'svelte';

  const { label, value, validate, placeholder, onChange } = $props<{ label : string, value: string | undefined, validate: Function, placeholder?: string | undefined, onChange: (newName: string, valid: boolean) => void}>();

  let inputValue = $state(value);
  
  let errorMessage = $derived(() => {
    const validation = validate(inputValue);
    return validation === 'safe' ? '' : validation;
  });

  function handleChange(event: any) {
    inputValue = (event.target as HTMLInputElement).value;
    if (value != inputValue) {
      onChange(inputValue, !errorMessage());
    }
  }

  onMount(() => {
    handleChange({ target: { value: inputValue } });
  });

  $effect(() => {
    if (value != inputValue) {
      onChange(inputValue, !errorMessage());
    }
  });
</script>

<label class="form-control w-full pl-4">
  <div class="label">
    <span class="label-text">{label}</span>
  </div>

  <input
    type="text"
    class="input input-bordered w-auto ml-3 {errorMessage() ? 'input-error' : ''}"
    bind:value={inputValue}
    oninput={handleChange}
    placeholder={placeholder}
  />

  {#if errorMessage()}
    <div class="label">
      <span class="label-text-alt text-error">{errorMessage()}</span>
    </div>
  {/if}
</label>
