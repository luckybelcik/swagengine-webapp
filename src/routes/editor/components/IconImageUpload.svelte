<script lang="ts">
  import { defaultIconUrl, engineStore, resetIcon, setIconUrl } from '$lib/stores/engineStore';

  const projectIconUrl = $derived(() => {
    const engineStoreValue = $engineStore;

    return engineStoreValue.projectData.iconurl;
  });

  let fileInput: HTMLInputElement | undefined = $state(undefined);

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        resetIcon();
        if (fileInput) fileInput.value = '';
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        setIconUrl(e.target?.result as string);
      };

      reader.readAsDataURL(file);
    } else {
      resetIcon();
    }
  }

  function removeImage() {
    resetIcon();
    if (fileInput) fileInput.value = '';
  }
</script>

<div class="form-control w-full max-w-xs">
  <span class="label">
    <span class="label-text">Project Icon</span>
  </span>

  <div>
    {#if projectIconUrl() && projectIconUrl() != defaultIconUrl}
      <div class="avatar">
        <div class="w-30 h-30 rounded-lg overflow-hidden flex-shrink-0 m-3 ml-0">
          <img src={projectIconUrl()} alt="Project Icon Preview" />
        </div>
      </div>
      <div class="flex gap-2 w-full items-center">
        <button class="btn btn-sm btn-error" onclick={resetIcon}>Remove</button>
        <label for="file-upload-input" class="btn btn-sm btn-info flex-shrink-0 cursor-pointer">
          Select New Image
        </label>
      </div>
    {:else}
      <label for="file-upload-input" class="btn btn-sm btn-info flex-shrink-0 cursor-pointer mt-2">
        Select Image
      </label>
    {/if}
  </div>

  <input
    id="file-upload-input"
    type="file"
    class="hidden" accept="image/*"
    onchange={handleFileChange}
    bind:this={fileInput}
  />
</div>