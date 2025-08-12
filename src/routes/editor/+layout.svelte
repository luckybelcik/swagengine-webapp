<script lang="ts">
    let { children } = $props();
    import "../../app.css";
    import Navbar from "$lib/components/Navbar.svelte";
    import { createNewElement,
      engineStore} from '$lib/stores/engineStore';
    import { strictValidation, softValidation, typeValidation, parseBoolean, swapBackRemoveIndex } from "./utils/util";
    import FormModal from "./components/FormModal.svelte";
    import { FIXED_ELEMENT_TYPES, HOVER_IMAGE_DELAY_MS } from "$lib/data/_constant_data";
    import { get } from "svelte/store";
    import { nodeIndexToRemove, userPreferenceStore } from "$lib/stores/userPreferenceStore";
    import Oneko from "./components/Oneko.svelte";

  let imageNodes: HTMLImageElement[] = $state([]);
  let imageHoverState = new Set<string>();
  let hoverTimeouts = new Map<string, any>()

  let showCreateElementModal = $state(false);
  let ErrorMessage = $state('');
  let ErrorField = $state('');
  let elementCount = $state(get(engineStore).loadedElements.length);
  
  let gradientOpacity = $derived(`opacity-${$userPreferenceStore.preferences.gradientOpacity}`);

  function updatePosition(node: HTMLImageElement, name: string, image: any) {
    if (!node) return;

    if (image.HoverLink) {
      node.style.pointerEvents = 'auto';
    } else {
      node.style.pointerEvents = 'none';
    }

    if (image.HoverLink && imageHoverState.has(name)) {
      node.src = image.HoverLink;
    } else if (image.ImageLink) {
      node.src = image.ImageLink;
    } else {
      node.src = '';
    }

    node.style.left = `${parseInt(image.X)}px`;
    node.style.bottom = `${parseInt(image.Y)}px`;
    node.style.width = `${image.Scale}%`;
    node.style.rotate = `${image.Rotation}deg`; 
    
    node.style.transform = image.Flipped ? 'scaleX(-1)' : 'scaleX(1)';
    node.style.zIndex = image.OnTop ? '9999' : '-100';

    node.style.opacity = `${image.Opacity * 0.01}`;
  }

  $effect(() => {
    if ($nodeIndexToRemove && $nodeIndexToRemove.length > 0) {
      const indices = $nodeIndexToRemove.sort((a, b) => b - a);
      indices.forEach(index => {
        imageNodes = swapBackRemoveIndex(imageNodes, index);
      });
      $nodeIndexToRemove = [];
    }

    for (let i = 0; i < imageNodes.length; i++) {
      const node = imageNodes[i];
      const [name, imageData] = Object.entries($userPreferenceStore.images)[i];
      if (node && imageData) updatePosition(node, name, imageData);
    }
  });

  function handleMouseEnter(imageNode: HTMLImageElement, name: string, image: any) {
    if (hoverTimeouts.has(name)) {
      clearTimeout(hoverTimeouts.get(name));
      hoverTimeouts.delete(name);
    }
    imageHoverState.add(name);
    updatePosition(imageNode, name, image);
  }

  function handleMouseLeave(imageNode: HTMLImageElement, name: string, image: any) {
    const timeoutId = setTimeout(() => {
      imageHoverState.delete(name);
      hoverTimeouts.delete(name);
      updatePosition(imageNode, name, image);
    }, HOVER_IMAGE_DELAY_MS);
    hoverTimeouts.set(name, timeoutId);
  }

  const EngineVersion = get(engineStore).projectData.engineVersion;
  const WebAppVersion = get(engineStore).projectData.webAppVersion;

  function openCreateElementModal() {
    ErrorMessage = '';
    ErrorField = '';
    showCreateElementModal = true;
  }

  function closeCreateElementModal() {
    showCreateElementModal = false;
  }

  function handleCreateElement(values: Record<string, string>) {
    ErrorMessage = '';
    ErrorField = '';

    const newName = values.elementName.trim();
    const newId = values.elementID.trim().toLowerCase().replace(/ /g,"_");
    const newType = values.elementType.trim().toLowerCase().replace(/ /g,"_");

    let validation;

    validation = softValidation(newName);
    
    if (validation !== 'safe') {
      ErrorMessage = validation;
      ErrorField = 'elementName';
      return;
    }

    validation = strictValidation(newId);
    if (validation !== 'safe') {
      ErrorMessage = validation;
      ErrorField = 'elementID';
      return;
    }

    validation = typeValidation(newType);
    if (validation !== 'safe') {
      ErrorMessage = validation;
      ErrorField = 'elementType';
      return;
    }

    try {
      let newElement = null;
      newElement = createNewElement(newName, newId, newType);

      console.log(`Created new element with ID: ${newId} and Type: ${newType}`);
      console.log(`New element:`, newElement);
      elementCount++;
      closeCreateElementModal();
    } catch (error: any) {
      console.error("Error creating element:", error.message);
      ErrorMessage = `Failed to create element: ${error.message}`;
    }
  }
</script>

<div class="flex flex-col min-h-screen">
  <div class="shadow-sm">
      <Navbar />
  </div>

  <div class="flex flex-grow overflow-hidden">
    <div class="w-64 bg-base-300 shadow-lg p-4 flex-none overflow-y-auto">
      <h2 class="text-xl font-semibold mb-4">Sidebar Menu</h2>
      <ul class="menu mb-4 bg-base-200 rounded-box">
        <li class="menu-title"><span>Element Management</span></li>
        <li><button onclick={openCreateElementModal}>Add New Element</button></li>
      </ul>
      <div class="p-2 border-t border-base-content/10">
        <p class="text-sm text-base-content/80">{elementCount} elements</p>
        <p class="text-sm text-base-content/80">0 methods</p>
        <p class="text-sm text-base-content/80">0 assets</p>
      </div>
      <div class="p-2 border-t border-base-content/10">
        <p class="text-sm text-base-content/80">Engine v{EngineVersion}</p>
        <p class="text-sm text-base-content/80">Redbud v{WebAppVersion}</p>
        <p class="text-sm text-base-content/80">{get(engineStore).projectData.name} v{get(engineStore).projectData.projectVersion}</p>
      </div>
    </div>

    
    <main class="flex-grow">
      <Oneko></Oneko>
      <div class="background-gradient fixed left-64 right-0 h-[40%] bottom-0 z-[0] pointer-events-none bg-gradient-to-b to-primary {gradientOpacity}"></div>
      {#each Object.entries($userPreferenceStore.images) as [name, image], i (name)}
        <img bind:this={imageNodes[i]} class="fixed" alt="Image Node for {name}."
        onerror={(e) => {
          const image = e.target as HTMLImageElement;
          image.src = "https://image2url.com/images/1754998813754-fe681684-e76d-4abe-ba62-1a246f0b01df.webp";
          image.style.opacity = "0.5"
          image.style.zIndex = "9999" }}
        onmouseenter={() => handleMouseEnter(imageNodes[i], name, image)}
        onmouseleave={() => handleMouseLeave(imageNodes[i], name, image)}/>
      {/each}
      {@render children()}
    </main>
  </div>

  <FormModal
    title="New Element"
    show={showCreateElementModal}
    onClose={closeCreateElementModal}
    onSubmit={handleCreateElement}
    fields={[
      { name: "elementName", label: "Element Name", placeholder: "e.g., New Element", 
        description: "The element names will be used for the english translation file."},
      { name: "elementID", label: "Element ID", placeholder: "e.g., new_element", 
        description: "Element IDs are used for element identification in code, etc. They can't be changed directly after creation because it corrupts existing items of that ID"},
      { name: "elementType", label: "Element Type", placeholder: "e.g., item, entity, tile", 
        description: "Element types determine basic behavior",
        type: "enum", enum_values: [...FIXED_ELEMENT_TYPES] }
    ]}
    errorMessage={ErrorMessage}
    errorField={ErrorField}
  />
</div>