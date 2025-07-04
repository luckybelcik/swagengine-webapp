import { writable } from 'svelte/store';

const initialEngineState = {
    commands: [],
    entities: [],
    items: [],
    tiles: [],

    projectData: {
        name: 'defaultName',
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
