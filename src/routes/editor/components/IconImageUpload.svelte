<script lang="ts">
  import { engineStore, setProjectProperty } from '$lib/stores/engineStore';
  import { DEFAULT_ICON_URL } from '$lib/data/_constant_data';

  const projectIconUrl = $derived(() => {
    const engineStoreValue = $engineStore;

    return engineStoreValue.projectData.iconurl;
  });
</script>

<div class="form-control w-full max-w-xs">
  <span class="label">
    <span class="label-text">Project Icon</span>
  </span>

  <div>
    {#if projectIconUrl() && projectIconUrl() != DEFAULT_ICON_URL}
      <div class="avatar">
        <div class="w-30 h-30 rounded-lg overflow-hidden flex-shrink-0 m-3 ml-0">
          <img src={projectIconUrl()} alt="Project Icon Preview" />
        </div>
      </div>
      <div class="flex gap-2 w-full items-center">
        <button class="btn btn-sm btn-error" onclick={() => setProjectProperty("iconurl", DEFAULT_ICON_URL)}>Remove</button>
        <label for="file-upload-input" class="btn btn-sm btn-info flex-shrink-0 cursor-pointer">
          Select New Image
        </label>
      </div>
    {:else}
      <label for="file-upload-input-navbar" class="btn btn-sm btn-info flex-shrink-0 cursor-pointer mt-2">
        Select Image
      </label>
    {/if}
  </div>
</div>