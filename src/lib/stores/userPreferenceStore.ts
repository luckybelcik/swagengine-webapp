import { writable, get } from 'svelte/store';

export interface UserPreferenceStore {
  preferences: Record<string, any>
}

const initialUserPreferenceStore: UserPreferenceStore = {
  preferences: [
    { coloredElementCards: true },
    { isDarkMode: true },
    { showComponentIcons: true }
  ]
}

export const userPreferenceStore = writable<UserPreferenceStore>(initialUserPreferenceStore);

export function updatePreference(preferenceName: string, newValue: any): void {
  userPreferenceStore.update(currentStore => {
    if (currentStore.preferences && currentStore.preferences.length > 0) {
      const updatedPreferencesObject = { ...currentStore.preferences[0] };

      updatedPreferencesObject[preferenceName] = newValue;

      return {
        ...currentStore,
        preferences: [updatedPreferencesObject]
      };
    } else {
      console.warn("UserPreferenceStore.preferences is not in the expected format or is empty. No preference was updated.");
      return currentStore;
    }
  });
}

export function getPreference(preferenceName: string): any {
  const store = get(userPreferenceStore);

  if (store.preferences && store.preferences.length > 0) {
    return store.preferences[0][preferenceName];
  } else {
    console.warn("UserPreferenceStore.preferences is not in the expected format or is empty. Cannot retrieve preference:", preferenceName);
    return undefined;
  }
}