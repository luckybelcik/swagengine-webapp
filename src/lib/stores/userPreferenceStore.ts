import { LOCAL_STORAGE_KEY_PREFERENCES } from '$lib/data/_static_data';
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

function getInitialValue() {
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY_PREFERENCES);
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (e) {
        console.error("Error parsing stored data from localStorage:", e);
        return initialUserPreferenceStore;
      }
    }
  }
  return initialUserPreferenceStore;
}

export const userPreferenceStore = writable<UserPreferenceStore>(getInitialValue());

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

userPreferenceStore.subscribe(value => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFERENCES, JSON.stringify(value));
    console.log("Saved to localStorage")
  } catch (e) {
    console.error("Error saving message data to localStorage:", e);
  }
})