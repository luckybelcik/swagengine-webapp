import { elementIdExists } from "$lib/stores/engineStore";
import { BIT_32_FLOAT_MAX, BIT_32_FLOAT_MIN, FIXED_ELEMENT_TYPES } from "$lib/data/_constant_data";

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

export const swapBackRemove = (array: string[], object_to_remove: string): string[] => {
  const indexToDelete = array.indexOf(object_to_remove);

  if (indexToDelete !== -1) {
    const newComponents = [...array];

    if (indexToDelete !== newComponents.length - 1) {
        newComponents[indexToDelete] = newComponents[newComponents.length - 1];
    }
    newComponents.pop();

    return newComponents
  }

  return array;
}

export const toCamelCase = (str: string): string => {
  return str.split(' ').map((word, index) => {
    if (index === 0) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('');
}

export const snakeCaseToCapitalized = (str: string): string => {
  if (typeof str !== 'string' || str.length === 0) {
    return '';
  }
  const spacedString = str.replace(/_/g, ' ');

  const capitalizedString = spacedString
    .split(' ')
    .map(word => {
      if (word.length > 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return '';
    })
    .join(' ');

  return capitalizedString;
}

export const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
  }

export const clampBigInt = (value: bigint, min: bigint, max: bigint): bigint => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const clampTo32BitFloat = (value: number): number => {
  return clamp(value, BIT_32_FLOAT_MIN, BIT_32_FLOAT_MAX);
}

export const handleNan = (value: any): string => {
  if (value == undefined || Number.isNaN(value)) {
    return "0";
  } else {
    return value.toString();
  }
}

