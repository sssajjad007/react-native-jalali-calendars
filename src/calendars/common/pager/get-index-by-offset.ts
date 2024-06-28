export const getIndexByOffset = (
  offset: number,
  option: {length: number; indexMin?: number; indexMax: number},
): number => {
  const {indexMax, indexMin = 0, length} = option;
  if (length <= 0) {
    if (__DEV__) {
      throw new Error('The length cannot be <= 0');
    }
    return 0;
  }

  const calc = Math.trunc((offset + length / 2) / length);

  if (calc < indexMin) {
    return indexMin;
  } else if (calc > indexMax) {
    return indexMax;
  } else {
    return calc;
  }
};
