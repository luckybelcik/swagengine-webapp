import { writable, get } from 'svelte/store';
import { type EditorTab } from '$lib/data/_definitions';
import { INITIAL_TABS, TYPE_ICON_SVGS } from '$lib/data/_constant_data';
import { getElementType } from './engineStore';

export const openTabs = writable<EditorTab[]>(INITIAL_TABS);
export const activeTabId = writable<string>(INITIAL_TABS[0].id);

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
    icon: TYPE_ICON_SVGS[getElementType(elementId) as keyof typeof TYPE_ICON_SVGS],
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