<script lang="ts">
    import { softValidationVariable } from "../utils/validation";

  let { label, value, validate, onChange, placeholder, maxCharacters, minCharacters, bigInput } = $props<{ label : string, value: string | undefined, validate: Function, placeholder?: string | undefined, onChange: (newName: string, valid: boolean) => void, maxCharacters?: number, minCharacters?: number, bigInput?: boolean}>();
  
  let errorMessage = $derived(() => {
    if (validate == softValidationVariable) {
      const validation = softValidationVariable(value, minCharacters, maxCharacters);
      return validation === 'safe' ? '' : validation;
    } else {
      const validation = validate(value);
      return validation === 'safe' ? '' : validation;
    }
  });

  function handleChange(event: any) {
    value = (event.target as HTMLInputElement).value;
    if (value) {
      onChange(value, !errorMessage());
    }
  }
</script>

<label class="form-control w-full">
  <div class="label">
    <span class="label-text">{label}</span>
  </div>

  {#if bigInput == true}
    <textarea
      class="input input-bordered w-full h-30 mt-3 p-1 pl-2 pr-2 {errorMessage() ? 'input-error' : ''}"
      bind:value
      oninput={handleChange}
      placeholder={placeholder}
      rows="4"
      style="white-space: normal; overflow-wrap: break-word; word-break: break-word;"
    ></textarea>
  {:else}
    <input
      type="text"
      class="input ml-3 input-bordered w-auto {errorMessage() ? 'input-error' : ''}"
      bind:value
      oninput={handleChange}
      placeholder={placeholder}
    />
  {/if}

  {#if errorMessage()}
    <div class="label">
      <span class="label-text-alt text-error">{errorMessage()}</span>
    </div>
  {/if}
</label>
