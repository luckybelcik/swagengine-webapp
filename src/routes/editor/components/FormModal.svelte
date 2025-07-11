<script lang="ts">
  interface FormField {
    name: string;
    label: string;
    description: string;
    placeholder?: string;
    type?: string;
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
        <input
          type="text"
          placeholder={field.placeholder}
          class="input input-bordered w-full {errorField === field.name ? 'input-error' : ''}"
          bind:value={formValues[field.name]}
        />
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
  <form method="dialog" class="modal-backdrop" on:click={onClose}>
    <button>close</button>
  </form>
</dialog>
{/if}