import { computed, effect, Signal, signal } from "@preact/signals-core";
import {
  MutationObserver,
  MutationObserverOptions,
  MutationObserverResult,
  QueryClient,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
} from "@tanstack/query-core";

/**
 * Default query client
 */
export const defaultQueryClient = new QueryClient();

/**
 * Types
 */
export type SignalQuery<T> = ReturnType<typeof query<T>>;
export type SignalMutation<U, T = void> = ReturnType<typeof mutation<T, U>>;

/**
 * NOTE: This is a simplified version of the tanstack-query query interface
 */
export function query<T>(
  getQueryConfig: () => QueryObserverOptions<T>,
  getQueryClient: () => QueryClient = () => defaultQueryClient,
) {
  const queryConfig = computed(() => getQueryConfig());
  const queryClient = computed(() => getQueryClient());
  const queryObserver = computed(
    () => new QueryObserver(queryClient.value, queryConfig.value),
  );

  const queryResultSignal: Signal<QueryObserverResult<T, Error>> = signal(
    queryObserver.value.getCurrentResult(),
  );

  effect(() => {
    const disposeQuerySubscription = queryObserver.value.subscribe(
      (result) => (queryResultSignal.value = result),
    );

    return () => {
      disposeQuerySubscription();
    };
  });

  return queryResultSignal;
}

/**
 * NOTE: This is a simplified version of the tanstack-query mutation interface
 */
export function mutation<T, V = void, U = Error, X = unknown>(
  getMutationConfig: () => MutationObserverOptions<T, U, V, X>,
  getQueryClient: () => QueryClient = () => defaultQueryClient,
) {
  const mutationConfig = computed(() => getMutationConfig());
  const queryClient = computed(() => getQueryClient());
  const mutationObserver = computed(
    () => new MutationObserver(queryClient.value, mutationConfig.value),
  );

  const mutationResultSignal: Signal<MutationObserverResult<T, U, V, X>> =
    signal(mutationObserver.value.getCurrentResult());

  effect(() => {
    const disposeMutationSubscription = mutationObserver.value.subscribe(
      (result) => (mutationResultSignal.value = result),
    );

    return () => {
      disposeMutationSubscription();
    };
  });

  return mutationResultSignal;
}
