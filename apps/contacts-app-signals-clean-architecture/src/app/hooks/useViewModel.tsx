import { useEffect, useRef } from 'react';
import { IViewModel } from '../core/types';

/**
 * A hook that creates and manages a view model instance.
 * The view model will be recreated if the dependencies array changes.
 * 
 * @param createFn Function that creates a new view model instance
 * @param dependencies An array of dependencies that will trigger recreation of the view model when changed
 * @returns The view model instance
 */
export function useViewModel<T extends IViewModel>(
  createFn: () => T, 
  dependencies: React.DependencyList = []
): T {
  // Store the view model instance in a ref to ensure it persists across renders
  const viewModelRef = useRef<T | null>(null);
  
  // Create the initial instance if it doesn't exist yet
  // This is crucial to have a valid instance before the first render
  if (viewModelRef.current === null) {
    viewModelRef.current = createFn();
  }
  
  // Store the createFn to access in the effect
  const createFnRef = useRef(createFn);
  createFnRef.current = createFn; // Always keep the latest createFn
  
  // Handle dependency changes and cleanup
  useEffect(() => {
    // For dependency changes after the first render:
    // We need to recreate the view model if dependencies changed
    // but we already have an initial instance from above
    const isFirstRender = dependencies.length === 0 || 
      !viewModelRef.current || 
      Object.keys(viewModelRef.current).length === 0;
    
    if (!isFirstRender) {
      // Clean up previous instance
      if (viewModelRef.current) {
        viewModelRef.current.dispose();
        viewModelRef.current = null;
      }
      
      // Create new instance
      viewModelRef.current = createFnRef.current();
    }
    
    // Clean up when unmounting or when dependencies change
    return () => {
      if (viewModelRef.current) {
        viewModelRef.current.dispose();
        viewModelRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]); // Re-run when dependencies change

  return viewModelRef.current as T;
}
