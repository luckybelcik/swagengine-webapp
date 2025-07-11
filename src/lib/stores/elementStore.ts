import { derived } from 'svelte/store';
import { engineStore } from '$lib/stores/engineStore';

export const elementStore = derived(engineStore, $engineStore => {
  return $engineStore.elements.find(el => el.id);
});