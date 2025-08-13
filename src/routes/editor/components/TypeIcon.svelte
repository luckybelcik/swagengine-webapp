<script lang="ts">
    import { TYPE_ICON_SVGS } from "$lib/data/_constant_data";

  const { elementType } = $props<{ elementType: keyof typeof TYPE_ICON_SVGS }>();
  const safeElementType: keyof typeof TYPE_ICON_SVGS = elementType;

  let scale = $state(0);
  switch (elementType) {
    case "item": scale = 1; break;
    case "tile": scale = 0.8; break;
    case "entity": scale = 0.8; break;
    case "command": scale = 0.9; break;
    case "boss": scale = 0.7; break;
  
    default:
      scale = 1;
  }
</script>

<div class="icon-container">
  <div style="scale: {scale}">
    {@html TYPE_ICON_SVGS[safeElementType]}
  </div>
</div>