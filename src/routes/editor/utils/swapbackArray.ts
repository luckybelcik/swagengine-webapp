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