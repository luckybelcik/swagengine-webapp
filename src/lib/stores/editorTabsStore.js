import { writable } from 'svelte/store';

/**
 * @typedef {'browser' | 'element' | 'asset' | 'method'} TabType
 */

/**
 * @typedef {object} EditorTab
 * @property {string} id - Unique ID for the tab (e.g., 'browser', or element ID)
 * @property {TabType} type - Type of content in the tab (e.g., 'browser', 'element')
 * @property {string} name - Display name for the tab
 * @property {string} icon - SVG path string or class for the tab's icon
 * @property {boolean} closable - Can this tab be closed by the user?
 * @property {string} [elementId] - Optional: If type is 'element', the ID of the element it represents
 */

/** @type {EditorTab[]} */
const initialTabs = [
  {
    id: 'browser',
    type: 'browser',
    name: 'Browse Elements',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
             <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
           </svg>`,
    closable: false,
  },
];

export const openTabs = writable(initialTabs);

export const activeTabId = writable(initialTabs[0].id);

/**
 * Adds a new tab or sets an existing one as active.
 * @param {EditorTab} newTab - The tab object to add/activate.
 */
export const addOrActivateTab = (newTab) => {
  openTabs.update(tabs => {
    // Check if the tab already exists
    const existingTab = tabs.find(tab => tab.id === newTab.id);
    if (!existingTab) {
      // If not, add it
      tabs = [...tabs, newTab];
    }
    return tabs;
  });
  // Set it as active
  activeTabId.set(newTab.id);
};

/**
 * Removes a tab by its ID.
 * Activates an adjacent tab if the removed tab was active.
 * @param {string} id - The ID of the tab to remove.
 */
export const removeTab = (id) => {
  openTabs.update(tabs => {
    const tabToRemoveIndex = tabs.findIndex(tab => tab.id === id);
    if (tabToRemoveIndex === -1) return tabs; // Tab not found

    // If the removed tab was active, try to activate another one
    activeTabId.update(currentActiveId => {
      if (currentActiveId === id) {
        // Activate the tab to the left, or to the right, or the browser tab
        const newActiveTab = tabs[tabToRemoveIndex - 1] || tabs[tabToRemoveIndex + 1] || tabs.find(t => t.type === 'browser');
        return newActiveTab ? newActiveTab.id : ''; // Fallback to empty if no tabs left (shouldn't happen with browser tab)
      }
      return currentActiveId;
    });

    // Filter out the removed tab
    return tabs.filter(tab => tab.id !== id);
  });
};

/**
 * Sets the active tab by its ID.
 * @param {string} id - The ID of the tab to make active.
 */
export const setActiveTab = (id) => {
  activeTabId.set(id);
};

/**
 * Opens an element tab.
 * @param {string} elementId - The ID of the element to open.
 * @param {string} elementName - The name of the element to display in the tab.
 */
export const openElementTab = (elementId, elementName) => {
  addOrActivateTab({
    id: elementId,
    type: 'element',
    name: elementName,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
             <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9m2.25 2.25L15 15m0 0l5.197 5.197M15 15l6.05-6.05m1.5-1.5-1.5 1.5m-1.5-1.5.75-.75ZM4.5 19.5l.75-.75m0 0L9 15m-1.5 0-1.5 1.5M15 10.5l-1.5-1.5m-1.5 1.5L9 10.5M8.25 6.75l1.5-1.5M12 6l-.75.75m0 0-.75.75m0 0-.75.75M12 6V4.5m0 0V3"></path>
           </svg>`, // Generic element icon
    closable: true,
    elementId: elementId,
  });
};

/**
 * Sets the name of a tab by its ID.
 * @param {string} tabId - The ID of the tab to rename.
 * @param {string} newName - The new name for the tab.
 */
export const setTabName = (tabId, newName) => {
  openTabs.update(tabs =>
    tabs.map(tab =>
      tab.id === tabId ? { ...tab, name: newName } : tab
    )
  );
};