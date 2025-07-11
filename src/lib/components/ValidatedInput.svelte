<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';

  export let label = '';
  export let value = '';
  export let validate: (input: string) => string | 'safe';
  export let placeholder = '';

  const dispatch = createEventDispatcher();

  let inputValue = value;
  let errorMessage = '';

  function handleChange(event) {
    inputValue = event.target.value;
    const validation = validate(inputValue);

    errorMessage = validation === 'safe' ? '' : validation;

    dispatch('change', { value: inputValue, valid: !errorMessage });
  }

  onMount(() => {
    handleChange({ target: { value: inputValue } });
  });
</script>

<label class="form-control w-full pl-4">
  <div class="label">
    <span class="label-text">{label}</span>
  </div>

  <input
    type="text"
    class="input input-bordered w-auto ml-3 {errorMessage ? 'input-error' : ''}"
    bind:value={inputValue}
    on:input={handleChange}
    placeholder={placeholder}
  />

  {#if errorMessage}
    <div class="label">
      <span class="label-text-alt text-error">{errorMessage}</span>
    </div>
  {/if}
</label>
