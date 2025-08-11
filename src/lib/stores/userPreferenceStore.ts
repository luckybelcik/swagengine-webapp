import { LOCAL_STORAGE_KEY_PREFERENCES, INITIAL_USER_PREFERENCE_STORE } from '$lib/data/_constant_data';
import { writable, get } from 'svelte/store';

function getInitialValue() {
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY_PREFERENCES);
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        let transformedPreferences: Record<string, any> = {};

        if (Array.isArray(parsed.preferences)) {
          parsed.preferences.forEach((prefObj: Record<string, any>) => {
            Object.assign(transformedPreferences, prefObj);
          });
          if (transformedPreferences.theme) {
            setTheme(transformedPreferences.theme);
          }
          console.log("Loaded in preferences from old format.", { preferences: transformedPreferences })
          return { preferences: transformedPreferences };
        } else if (typeof parsed.preferences === 'object' && parsed.preferences !== null) {
          transformedPreferences = parsed.preferences;
          if (transformedPreferences.theme) {
            setTheme(transformedPreferences.theme);
          }
          console.log("Loaded in preferences and images from new format.", { preferences: transformedPreferences }, { images: parsed.images })
          return { preferences: transformedPreferences, images: parsed.images };
        } else {
          console.warn("Parsed preferences are not in an expected format. Using initial defaults.");
          return INITIAL_USER_PREFERENCE_STORE;
        }
      } catch (e) {
        console.error("Error parsing stored data from localStorage:", e);
        return INITIAL_USER_PREFERENCE_STORE;
      }
    }
  }
  return INITIAL_USER_PREFERENCE_STORE;
}

export const userPreferenceStore = writable<Record<string, any>>(getInitialValue());

export function updatePreference(preferenceName: string, newValue: any): void {
  userPreferenceStore.update(currentStore => {
    if (currentStore) {
      const updatedPreferences = { ...currentStore.preferences };
      updatedPreferences[preferenceName] = newValue;

      return {
        ...currentStore,
        preferences: updatedPreferences
      };
    } else {
      console.warn("UserPreferenceStore.preferences is not in the expected format or is empty. No preference was updated.");
      return currentStore;
    }
  });
}

export function updateImageProperty(imageName: string, imageProperty: string, newValue: any): void {
  userPreferenceStore.update(currentStore => {
    if (currentStore) {
      let updatedImages = { ...currentStore.images };
      let updatedImage = { ...updatedImages[imageName] };
      updatedImage[imageProperty] = newValue;
      updatedImages[imageName] = updatedImage;

      return {
        ...currentStore,
        images: updatedImages
      };
    } else {
      console.warn("UserPreferenceStore.images is not in the expected format or is empty. No images was updated.");
      return currentStore;
    }
  });
}

export function addImage(imageName: string): void {
  userPreferenceStore.update(currentStore => {
    if (currentStore) {
      let updatedImages = { ...currentStore.images, [imageName]: {
        Opacity: 0,
        X: 0,
        Y: 0,
        Scale: 0,
        Rotation: 0,
        Flipped: false,
        OnTop: false,
        ImageLink: '',
      } };

      return {
        ...currentStore,
        images: updatedImages
      };
    } else {
      console.warn("UserPreferenceStore.images is not in the expected format or is empty. No images was updated.");
      return currentStore;
    }
  });
}

export function removeImage(imageName: string): void {
  userPreferenceStore.update(currentStore => {
    if (currentStore) {
      const updatedImages = { ...currentStore.images };
      
      delete updatedImages[imageName];

      return {
        ...currentStore,
        images: updatedImages
      };
    } else {
      console.warn("UserPreferenceStore.images is not in the expected format or is empty. No images was removed.");
      return currentStore;
    }
  });
}

export function getPreference(preferenceName: string): any {
  const store = get(userPreferenceStore);

  if (store.preferences) {
    return store.preferences[preferenceName];
  } else {
    console.warn("UserPreferenceStore.preferences is not in the expected format or is empty. Cannot retrieve preference:", preferenceName);
    return undefined;
  }
}

export function getImageProperty(imageName: string, imageProperty: string): any {
  const store = get(userPreferenceStore);

  if (store && store.images && store.images[imageName] && store.images[imageName].hasOwnProperty(imageProperty)) {
    return store.images[imageName][imageProperty];
  } else {
    console.warn("UserPreferenceStore.images is not in the expected format or is empty. Cannot retrieve image property:", imageProperty, "of", imageName);
    return undefined;
  }
}

userPreferenceStore.subscribe(value => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFERENCES, JSON.stringify(value));
    console.log("Saved preferences to localStorage: ", value)
  } catch (e) {
    console.error("Error saving preference data to localStorage:", e);
  }
})

export function resetPreferences() {
  userPreferenceStore.set(INITIAL_USER_PREFERENCE_STORE);
  setTheme(INITIAL_USER_PREFERENCE_STORE.theme);
}

export function setTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function setDarkMode(value: boolean) {
  if (value) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }

  updatePreference("isDarkMode", value)
}

export function showComponentIcons(value: boolean) {
  if (value) {
    document.documentElement.classList.remove('component-icons-hidden');
  } else {
    document.documentElement.classList.add('component-icons-hidden');
  }

  updatePreference("showComponentIcons", value)
}

export function coloredElementCards(value: boolean) {
  if (value) {
    document.documentElement.classList.add('colored-cards');
    document.documentElement.classList.remove('grayscale-cards');
  } else {
    document.documentElement.classList.remove('colored-cards');
    document.documentElement.classList.add('grayscale-cards');
  }

  updatePreference("coloredElementCards", value)
}

export function showGradient(value: boolean) {
  if (value) {
    document.documentElement.classList.add('background-gradient-shown');
    document.documentElement.classList.remove('background-gradient-hidden');
  } else {
    document.documentElement.classList.remove('background-gradient-shown');
    document.documentElement.classList.add('background-gradient-hidden');
  }

  updatePreference("showGradient", value)
}