import { elementIdExists, FIXED_ELEMENT_TYPES } from "$lib/stores/engineStore";

export const idValidation = (id: string): string => {
    if (!id) {
      return 'Element ID cannot be empty.';
    }

    if (elementIdExists(id)) {
      return `Element ID '${id}' already exists.`;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(id)) {
        return 'ID can only contain letters, numbers, and underscores.';
    }

    if (id.length < 3 || id.length > 20) {
      return 'ID must be between 3 and 20 characters long.';
    }

    if (id.startsWith('_') || id.endsWith('_')) {
      return 'ID cannot start or end with an underscore.';
    }

    return 'safe';
}

export const nameValidation = (name: string): string => {
    if (name.length < 1 || name.length > 20) {
      return 'Name must be between 1 and 20 characters long.';
    }

    return 'safe';
}

export const typeValidation = (type: string): string => {
    if (!type) {
      return 'Element Type cannot be empty.';
    }

    if (!FIXED_ELEMENT_TYPES.includes(type as typeof FIXED_ELEMENT_TYPES[number])) {
      return `Element type '${type}' is not valid.`;
    }

    return 'safe';
}