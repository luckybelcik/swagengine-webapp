import type tab from 'daisyui/components/tab';
import { writable, get } from 'svelte/store';

// Define allowed tab types
export type TabType = 'browser' | 'element' | 'asset' | 'method';

// Define the EditorTab interface
export interface EditorTab {
  id: string;
  type: TabType;
  name: string;
  icon: string;
  closable: boolean;
  elementId?: string;
}

const initialTabs: EditorTab[] = [
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

export const openTabs = writable<EditorTab[]>(initialTabs);
export const activeTabId = writable<string>(initialTabs[0].id);

export const addOrActivateTab = (newTab: EditorTab) => {
  openTabs.update(tabs => {
    const exists = tabs.find(tab => tab.id === newTab.id);
    if (!exists) {
      tabs = [...tabs, newTab];
    }
    return tabs;
  });
  activeTabId.set(newTab.id);
};

export const closeTab = (id: string) => {
  openTabs.update(tabs => {
    const index = tabs.findIndex(tab => tab.id === id);
    if (index === -1) return tabs;

    activeTabId.update(current => {
      if (current === id) {
        const fallbackTab = tabs[index - 1] || tabs[index + 1] || tabs.find(t => t.type === 'browser');
        return fallbackTab ? fallbackTab.id : '';
      }
      return current;
    });

    return tabs.filter(tab => tab.id !== id);
  });
};

export const setActiveTab = (id: string) => {
  activeTabId.set(id);
};

export const openElementTab = (elementId: string, elementName: string) => {
  addOrActivateTab({
    id: elementId,
    type: 'element',
    name: elementName,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
             <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9m2.25 2.25L15 15m0 0l5.197 5.197M15 15l6.05-6.05m1.5-1.5-1.5 1.5m-1.5-1.5.75-.75ZM4.5 19.5l.75-.75m0 0L9 15m-1.5 0-1.5 1.5M15 10.5l-1.5-1.5m-1.5 1.5L9 10.5M8.25 6.75l1.5-1.5M12 6l-.75.75m0 0-.75.75m0 0-.75.75M12 6V4.5m0 0V3"></path>
           </svg>`,
    closable: true,
    elementId,
  });
};

export const setTabName = (tabId: string, newName: string) => {
  openTabs.update(tabs =>
    tabs.map(tab =>
      tab.id === tabId ? { ...tab, name: newName } : tab
    )
  );
};

export const reloadTab = (tabId: string) => {
  const tabs = get(openTabs);
  let tabToReload: EditorTab;
  tabs.forEach(tab => {
    if (tab.id == tabId) {
      tabToReload = tab;
      closeTab(tabId);
      setActiveTab('browser');
      setTimeout(() => {
        addOrActivateTab(tabToReload);
      }, 0)
      return;
    }
  });
}