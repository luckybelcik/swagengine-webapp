import { writable, get } from 'svelte/store';

export interface UserPreferenceStore {
  coloredElementCards: boolean;
}

const initialUserPreferenceStore: UserPreferenceStore = {
  coloredElementCards: true
}

export const userPreferenceStore = writable<UserPreferenceStore>(initialUserPreferenceStore);