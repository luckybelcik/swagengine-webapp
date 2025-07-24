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
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          console.error('Could not get 2D context for canvas.');
          setIconUrl(img.src);
          return;
        }

        const MAX_SIZE = 512;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        const size = Math.min(width, height);
        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;

        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        const sWidth = size;
        const sHeight = size;

        const dx = (MAX_SIZE - width) / 2;
        const dy = (MAX_SIZE - height) / 2;
        const dWidth = width;
        const dHeight = height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, MAX_SIZE, MAX_SIZE);

        const processedDataUrl = canvas.toDataURL('image/png', 0.9);

        setIconUrl(processedDataUrl);
      };

      img.onerror = () => {
        console.error("Error loading image for processing.");
        setIconUrl(e.target?.result as string);
      };
    };

      reader.readAsDataURL(file);
    } else {
      resetIcon();
    }
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