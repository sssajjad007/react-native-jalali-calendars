import {MutableRefObject, useCallback} from 'react';

type SetRef<T> =
  | ((instance: T | null) => void)
  | MutableRefObject<T | null | undefined>
  | null
  | undefined;

const setInstanceToRef = <T>(ref: SetRef<T>, instance: T | null) => {
  if (ref == null) {
    return;
  }
  if (typeof ref === 'function') {
    ref(instance);
  } else {
    ref.current = instance;
  }
};

const useSetRefs = <T>(...refs: ReadonlyArray<SetRef<T>>) => {
  return useCallback(
    (instance: T | null) => {
      refs.forEach((ref) => {
        setInstanceToRef(ref, instance);
      });
    },
    [...refs], // eslint-disable-line react-hooks/exhaustive-deps
  );
};

export default useSetRefs;
