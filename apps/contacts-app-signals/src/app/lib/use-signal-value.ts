import { Signal } from "@preact/signals-core";
import { useSyncExternalStore } from "react";

/**
 * Custom hook for connecting signals to React
 */
export const useSignalValue = <T>(signal: Signal<T>) => {
  return useSyncExternalStore(
    signal.subscribe.bind(signal),
    signal.peek.bind(signal),
  );
};

/**
 * Hook to select a signal from a store and subscribe to its value.
 * @param selector Function to select a Signal from the store.
 * @param store The store instance.
 */
export function useSignalSelector<TStore, TValue>(
  selector: (store: TStore) => Signal<TValue>,
  store: TStore
): TValue {
  const signal = selector(store);
  return useSyncExternalStore(
    signal.subscribe.bind(signal),
    signal.peek.bind(signal),
  );
}