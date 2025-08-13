import { INITIAL_STATIC_DATA_STORE } from "$lib/data/_constant_data";
import { get, writable } from "svelte/store";

export const staticDataStore = writable<Record<string, any>>(INITIAL_STATIC_DATA_STORE);

export function setData(dataIdentifier: string, newData: any): void {
  staticDataStore.update(currentStore => {
    if (currentStore) {
      const store = { ...currentStore };
      store[dataIdentifier] = newData;

      return {
        store
      };
    } else {
      console.warn("[redbud] (staticDataStore) staticDataStore is not in the expected format or is empty. No data was updated.");
      return currentStore;
    }
  });
}

export function getData(dataIdentifier: string): any {
  const store = get(staticDataStore);

  if (store[dataIdentifier]) {
    return store[dataIdentifier];
  } else {
    console.warn("[redbud] (staticDataStore) staticDataStore is not in the expected format or is empty. Cannot retrieve data:", dataIdentifier);
    return undefined;
  }
}