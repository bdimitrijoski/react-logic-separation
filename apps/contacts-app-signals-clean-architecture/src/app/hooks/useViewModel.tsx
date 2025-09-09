import { useEffect, useMemo, useRef } from 'react';
import { IViewModel } from '../core/types';

export function useViewModel<T extends IViewModel>(createFn: () => T): T {
  // hold on the same instance
  //   const viewModelRef = useRef<T>(createFn());

  const viewModelRef = useMemo(() => createFn(), [createFn]);
  useEffect(() => {
    return () => {
      if (viewModelRef) {
        viewModelRef.dispose();
      }
    };
  }, [viewModelRef]);

  return viewModelRef;
}
