import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {RefObject, useCallback, useEffect, useRef} from 'react';

type Events<T> = {
  onAttached?: (instance: T) => void;
  onUnattached?: (removedInstance: T | null) => void;
  onStopListening?: (lastInstance: T | null) => void;
};

const useRefInstanceLifeCycleEffect = <T>(
  ref: RefObject<T>,
  {onAttached, onUnattached, onStopListening}: Events<T>,
) => {
  const prevInstanceRef = useRef<T | null | undefined>(undefined);
  const onStableAttached = useStableCallback(onAttached);
  const onStableUnattached = useStableCallback(onUnattached);
  const onStableStopListening = useStableCallback(onStopListening);
  const tick = useCallback(() => {
    const prevInstance = prevInstanceRef.current;
    const curInstance = ref.current;
    if (prevInstance == null && curInstance != null) {
      onStableAttached(curInstance);
    } else if (prevInstance != null && curInstance == null) {
      onStableUnattached(prevInstance);
    } else if (
      prevInstance != null &&
      curInstance != null &&
      prevInstance !== curInstance
    ) {
      onStableUnattached(prevInstance);
      onStableAttached(curInstance);
    }
    prevInstanceRef.current = curInstance;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    tick();
    const intervalId = setInterval(tick, 1000);
    return () => {
      clearInterval(intervalId);
      onStableStopListening(prevInstanceRef.current ?? null);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useRefInstanceLifeCycleEffect;
