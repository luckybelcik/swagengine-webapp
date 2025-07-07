import { writable, get } from 'svelte/store';

export const FIXED_ELEMENT_TYPES = ['item', 'entity', 'tile', 'command', 'boss'];
export const FIXED_ENTITY_METHOD_HOOKS = ['OnSpawn', 'OnDeath', 'OnHit', 'OnTick'];
export const FIXED_ITEM_METHOD_HOOKS = ['OnUse', 'OnEquip', 'OnUnequip', 'OnPickup'];

const initialEngineState = {
    elements: [
        {
        id: 'item_sword',
        type: 'item',
        name: 'Iron Sword',
        data: {},
        methods: [
          {
            type: 'OnUse',
            code: '// Called when the item is used'
          }],
        createdAt: new Date().toISOString()
      },
    ],

    projectData: {
        name: 'newProject',
        description: 'this is the default project description',
        author: 'Author',
        projectVersion: '0.0.0',
        engineVersion: '0.0.1',
    }
}

export const engineStore = writable(initialEngineState);

/**
 * Sets the project name.
 * @param {string} name - The new name for the project.
 */
export const setProjectName = (name) => {
  engineStore.update(state => ({
    ...state,
    projectData: {
      ...state.projectData,
      name: name
    }
  }));
};

/**
 * Sets the project description.
 * @param {string} description - The new description for the project.
 */
export const setProjectDescription = (description) => {
  engineStore.update(state => ({
    ...state,
    projectData: {
      ...state.projectData,
      description: description
    }
  }));
};

/**
 * Sets the project author.
 * @param {string} author - The new author for the project.
 */
export const setProjectAuthor = (author) => {
  engineStore.update(state => ({
    ...state,
    projectData: {
      ...state.projectData,
      author: author
    }
  }));
};

/**
 * Sets the project's version.
 * @param {string} version - The new version string for the project.
 */
export const setProjectVersion = (version) => {
  engineStore.update(state => ({
    ...state,
    projectData: {
      ...state.projectData,
      projectVersion: version
    }
  }));
};

/**
 * Sets the engine version used by the project.
 * @param {string} version - The new engine version string.
 */
export const setEngineVersion = (version) => {
  engineStore.update(state => ({
    ...state,
    projectData: {
      ...state.projectData,
      engineVersion: version
    }
  }));
};

/**
 * Adds a new element.
 * @param {object} newElement - The element object to add.
 * @param {string} newElement.id
 * @param {string} newElement.type
 * @param {string} newElement.name
 * @param {object} newElement.data
 * @param {{type: string, code: string}[]} newElement.methods
 * @param {string} newElement.createdAt
 */
export const addElement = (newElement) => {
  engineStore.update(currentData => ({
    ...currentData,
    elements: [...currentData.elements, newElement]
  }));
};

/**
 * Checks if an element with the given ID already exists.
 * @param {string} id - The ID to check.
 * @returns {boolean} True if an element with this ID exists, false otherwise.
 */
export const elementIdExists = (id) => {
  return get(engineStore).elements.some(element => element.id === id);
};

/**
 * Creates and adds a new blank element to the store.
 * @param {string} id - The ID for the new element.
 * @returns {object} The newly created element.
 * @throws {Error} If an element with the given ID already exists.
 */
export const createNewElement = (id) => {
  if (elementIdExists(id)) {
    throw new Error(`Element with ID '${id}' already exists.`);
  }

  const newElement = {
    id: id,
    type: 'object', // Default type for a blank element
    name: 'New Element',
    data: {},       // Start with empty data
    methods: [],       // Start with empty code
    createdAt: new Date().toISOString()
  };

  addElement(newElement); // Use the existing addElement to push it to the store
  return newElement; // Return the new element for immediate use (e.g., opening a tab)
};

/**
 * Deletes an element by its ID.
 * @param {string} id - The ID of the element to delete.
 */
export const deleteElement = (id) => {
  engineStore.update(currentData => ({
    ...currentData,
    elements: currentData.elements.filter(element => element.id !== id)
  }));
};

/**
 * Updates properties of an existing element.
 * @param {string} id - The ID of the element to update.
 * @param {Partial<object>} updates - An object containing the properties to update (e.g., { name: 'New Name', data: { hp: 200 } }).
 */
export const updateElement = (id, updates) => {
  engineStore.update(currentData => ({
    ...currentData,
    elements: currentData.elements.map(element =>
      element.id === id ? { ...element, ...updates } : element
    )
  }));
};