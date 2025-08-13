<script lang="ts">
  interface FormField {
    name: string;
    label: string;
    description: string;
    placeholder?: string;
    type?: string;
    enum_values?: string[];
  }

  export let title = '';
  export const description = '';
  export let fields: FormField[] = []; 
  export let onSubmit: (values: Record<string, string>) => void;
  export let show = false;
  export let onClose: () => void;

  let formValues: Record<string, string> = {};
  export let errorMessage = '';
  export let errorField = '';

  $: formValues = fields.reduce((acc: Record<string, string>, field) => {
    acc[field.name] = '';
    return acc;
  }, {});
</script>

{#if show}
<dialog open class="modal modal-open">
  <div class="modal-box">
    <h3 class="font-bold text-lg text-center text-[30px] mb-6">{title}</h3>

    <label class="form-control w-full">
      {#each fields as field}
        <div class="label">
            <span class="label-text">{field.label}</span>
        </div>
        {#if field.type == "enum" && field.enum_values}
            <select class="select select-bordered w-full" bind:value={formValues[field.name]}>
                <option disabled selected value="">-- Select {field.type} --</option>
                {#each field.enum_values as opt}
                    <option value={opt}>{opt}</option>
                {/each}
            </select>
        {:else}
            <input
              type="text"
              placeholder={field.placeholder}
              class="input input-bordered w-full {errorField === field.name ? 'input-error' : ''}"
              bind:value={formValues[field.name]}
            />
        {/if}
        <p class="mb-4 text-xs opacity-30 hover:opacity-80 transition-opacity duration-500">{field.description}</p>
      {/each}

      {#if errorMessage}
        <div class="label">
          <span class="label-text-alt text-error">{errorMessage}</span>
        </div>
      {/if}
    </label>

    <div class="modal-action">
      <button class="btn btn-ghost" on:click={onClose}>Cancel</button>
      <button
        class="btn btn-primary"
        on:click={() => {
          try {
            onSubmit(formValues);
          } catch (e: any) {
            errorMessage = e.message;
          }
        }}
      >
        Submit
      </button>
    </div>
  </div>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <form method="dialog" class="modal-backdrop" on:click={onClose}>
    <button>close</button>
  </form>
</dialog>
{/if}