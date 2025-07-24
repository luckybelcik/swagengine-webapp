import { elementIdExists, FIXED_ELEMENT_TYPES } from "$lib/stores/engineStore";

/**
 * Used for strict validation, mainly for IDs.
 * @param input The input string to validate
 * @param isId Decides whether to check if duplicate element IDs exists
 * @returns Returns an error message if failed, 'safe' if succeeded
 */
export const strictValidation = (input: string, isId?:boolean ): string => {
    if (!input) {
      return 'This field cannot be empty.';
    }

    if (isId && elementIdExists(input)) {
      return `Element ID '${input}' already exists.`;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(input)) {
        return 'This field can only contain letters, numbers, and underscores.';
    }

    if (input.length < 3 || input.length > 20) {
      return 'This field must be between 3 and 20 characters long.';
    }

    if (input.startsWith('_') || input.endsWith('_')) {
      return 'This field cannot start or end with an underscore.';
    }

    return 'safe';
}

/**
 * Used for soft validation, like for names.
 * @param name The input string to validate
 * @returns Returns an error message if failed, 'safe' if succeeded
 */
export const softValidation = (name: string): string => {
    if (name.length < 1 || name.length > 20) {
      return 'This field must be between 1 and 20 characters long.';
    }

    return 'safe';
}

/**
 * Soft validation but with a variable character limit.
 * @param name The input string to validate
 * @param min_characters The minimum amount of characters required
 * @param max_characters The maximum amount of characters required
 * @returns Returns an error message if failed, 'safe' if succeeded
 */
export const softValidationVariable = (name: string, min_characters: number, max_characters: number): string => {
    if (name.length < min_characters || name.length > max_characters) {
      return `This field must be between ${min_characters} and ${max_characters} long.`;
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