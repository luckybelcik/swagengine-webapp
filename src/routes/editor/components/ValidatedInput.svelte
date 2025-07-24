<script lang="ts">
  let { label, value, validate, placeholder, onChange } = $props<{ label : string, value: string | undefined, validate: Function, placeholder?: string | undefined, onChange: (newName: string, valid: boolean) => void}>();
  
  let errorMessage = $derived(() => {
    const validation = validate(value);
    return validation === 'safe' ? '' : validation;
  });

  function handleChange(event: any) {
    value = (event.target as HTMLInputElement).value;
    if (value) {
      onChange(value, !errorMessage());
    }
  }
</script>

<label class="form-control w-full pl-4">
  <div class="label">
    <span class="label-text">{label}</span>
  </div>

  <input
    type="text"
    class="input input-bordered w-auto ml-3 {errorMessage() ? 'input-error' : ''}"
    bind:value
    oninput={handleChange}
    placeholder={placeholder}
  />

  {#if errorMessage()}
    <div class="label">
      <span class="label-text-alt text-error">{errorMessage()}</span>
    </div>
  {/if}
</label>
