import { computed, effect, signal, Signal } from "@preact/signals-core";
import * as arrayDiff from "fast-array-diff";

/**
 * TODO: This currently does not support updates to
 * shuffling elements without the instance being
 * cleaned up and the setup again - add this
 */
export function mapSignalArray<T, U>(
  input: Signal<T[]>,
  setupFn: (item: T) => U,
  cleanupFn?: (item: U) => void,
  compareFn?: (a: T, b: T) => boolean,
): Signal<U[]> {
  // Make a noop
  const noop: () => U = (() => {}) as () => U;

  // keep reference to previous value of array for diffing
  const previousInput = previous(input, []);

  // store effect disposal function for each of the elements
  const output: Signal<U[]> = signal([]);

  effect(() => {
    // listen to original array for changes
    const outputValue = output.peek();
    const inputValue = input.value;
    const previousInputValue = previousInput.peek();

    // get a diff patch of the changes
    const diffPatch = arrayDiff.getPatch(
      previousInputValue,
      inputValue,
      compareFn,
    );

    // figure our which of the effect to dispose
    diffPatch
      .filter((patch) => patch.type === "remove")
      .map((patch) => patch.oldPos)
      .map((index) => outputValue[index])
      .forEach((val) => cleanupFn?.(val));

    // map the diff patch info the correct format
    const mappedDiffPatch = diffPatch.map((patch) => {
      switch (patch.type) {
        case "add":
          return { ...patch, items: patch.items.map((item) => setupFn(item)) };
        case "remove":
          return { ...patch, items: patch.items.map(noop) };
      }
    });

    // apply the patch
    output.value = arrayDiff.applyPatch(outputValue, mappedDiffPatch);
  });

  return output;
}

export function arrayEffect<T>(
  input: Signal<T[]>,
  effectFn: (item: T) => (() => void) | void,
) {
  const disposals = mapSignalArray(input, effectFn, (dispose) => dispose?.());
  return () => {
    disposals.value.forEach((dispose) => dispose?.());
  };
}

// NOTE: Inspired by https://www.pzuraq.com/blog/on-signal-relays
export function relay<T>(
  initialState: T,
  setup: (set: (newValue: T) => void, get: () => T) => (() => void) | void,
): [Signal<T>, Parameters<typeof setup>[0], () => void] {
  const stateSignal = signal(initialState);
  const get: Parameters<typeof setup>[1] = () => stateSignal.peek();
  const set: Parameters<typeof setup>[0] = (newValue: T) => {
    stateSignal.value = newValue;
  };
  const dispose = effect(() => setup(set, get));
  return [stateSignal, set, dispose];
}

export function debounced<T>(inputSignal: Signal<T>, debounceTimeInMs: number) {
  const [debouncedSignal] = relay(inputSignal.value, (set) => {
    const valueToDebounce = inputSignal.value;

    const debounceTimeout = setTimeout(() => {
      set(valueToDebounce);
    }, debounceTimeInMs);

    return () => {
      clearTimeout(debounceTimeout);
    };
  });

  const readOnlyDebouncedSignal = computed(() => debouncedSignal.value);

  return readOnlyDebouncedSignal;
}

export function previous<T>(
  inputSignal: Signal<T>,
  initialValue: T = inputSignal.value,
) {
  const [previousSignal] = relay(initialValue, (set) => {
    const currentValue = inputSignal.value;

    return () => {
      set(currentValue);
    };
  });

  const readOnlyPreviousSignal = computed(() => previousSignal.value);

  return readOnlyPreviousSignal;
}

export function derived<T>(
  getPromise: (abortSignal: AbortSignal) => Promise<T>,
) {
  const data = signal<T | undefined>(undefined);
  const isLoading = signal<boolean>(true);
  const error = signal<unknown>(null);

  effect(() => {
    let isCancelled = false;

    // Create abort controller
    const abortController = new AbortController();

    // Get the promise (this is where we create the dependency on whatever is in the delegate)
    const promise = getPromise(abortController.signal);

    promise
      .then((result) => {
        if (isCancelled) {
          return;
        }
        data.value = result;
        isLoading.value = false;
        error.value = null;
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }
        data.value = undefined;
        isLoading.value = false;
        error.value = error;
      });

    return () => {
      abortController.abort();
      isCancelled = true;

      isLoading.value = true;
      error.value = null;
    };
  });

  return { data, isLoading, error };
}

export function resource() {
  // TODO
}

export function reaction() {
  // TODO
}
