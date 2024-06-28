export const compareArray = <T>(
  arr1: ReadonlyArray<T>,
  arr2: ReadonlyArray<T>,
) => {
  return (
    arr1.length === arr2.length && arr1.every((x1, index) => x1 === arr2[index])
  );
};
