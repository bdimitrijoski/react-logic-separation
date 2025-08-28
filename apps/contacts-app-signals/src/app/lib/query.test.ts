import { signal } from "@preact/signals-core";
import { query, mutation } from "./query";
import { sleep } from "./utils";
import { QueryClient } from "@tanstack/query-core";

describe("query", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should initialize and resolve correctly (promise)", async () => {
    const queryClient = new QueryClient();

    const myQuery = query(
      () => ({
        queryKey: ["abc"],
        queryFn: () => Promise.resolve(10),
      }),
      () => queryClient,
    );

    expect(myQuery.value.isLoading).toBe(true);
    expect(myQuery.value.isPending).toBe(true);
    expect(myQuery.value.data).toEqual(undefined);
    expect(myQuery.value.error).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.value.isLoading).toBe(false);
    expect(myQuery.value.isPending).toBe(false);
    expect(myQuery.value.data).toEqual(10);
    expect(myQuery.value.error).toEqual(null);
  });

  it("should initialize and resolve correctly (async)", async () => {
    const queryClient = new QueryClient();

    const myQuery = query(
      () => ({
        queryKey: ["abc"],
        queryFn: async () => 10,
      }),
      () => queryClient,
    );

    expect(myQuery.value.isLoading).toBe(true);
    expect(myQuery.value.isPending).toBe(true);
    expect(myQuery.value.data).toEqual(undefined);
    expect(myQuery.value.error).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.value.isLoading).toBe(false);
    expect(myQuery.value.isPending).toBe(false);
    expect(myQuery.value.data).toEqual(10);
    expect(myQuery.value.error).toEqual(null);
  });

  it("should update according to dependencies", async () => {
    const queryClient = new QueryClient();

    const mySignal1 = signal("a");
    const mySignal2 = signal(10);

    const myQuery = query(
      () => ({
        queryKey: [`abc-${mySignal1.value}`],
        queryFn: async () => mySignal2.value,
      }),
      () => queryClient,
    );

    expect(myQuery.value.isLoading).toBe(true);
    expect(myQuery.value.isPending).toBe(true);
    expect(myQuery.value.data).toEqual(undefined);
    expect(myQuery.value.error).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.value.isLoading).toBe(false);
    expect(myQuery.value.isPending).toBe(false);
    expect(myQuery.value.data).toEqual(10);
    expect(myQuery.value.error).toEqual(null);

    // This changes the query function
    mySignal2.value = 20;

    expect(myQuery.value.isLoading).toBe(false);
    expect(myQuery.value.isPending).toBe(false);
    expect(myQuery.value.data).toEqual(10);
    expect(myQuery.value.error).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.value.isLoading).toBe(false);
    expect(myQuery.value.isPending).toBe(false);
    expect(myQuery.value.data).toEqual(20);
    expect(myQuery.value.error).toEqual(null);

    // This changes the cache key
    mySignal1.value = "b";

    expect(myQuery.value.isLoading).toBe(true);
    expect(myQuery.value.isPending).toBe(true);
    expect(myQuery.value.data).toEqual(undefined);
    expect(myQuery.value.error).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.value.isLoading).toBe(false);
    expect(myQuery.value.isPending).toBe(false);
    expect(myQuery.value.data).toEqual(20);
    expect(myQuery.value.error).toEqual(null);
  });
});

describe("mutation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should trigger re-fetching of query when mutation invalidates cache", async () => {
    const queryClient = new QueryClient();

    let count = 10;
    const getNextCount = () => count++;

    const queryKey = ["abc"];

    const myQuery = query(
      () => ({
        queryKey,
        queryFn: async () => {
          await sleep(100);
          return getNextCount();
        },
      }),
      () => queryClient,
    );

    expect(myQuery.value.isLoading).toBe(true);
    expect(myQuery.value.isPending).toBe(true);
    expect(myQuery.value.data).toEqual(undefined);
    expect(myQuery.value.error).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.value.isLoading).toBe(false);
    expect(myQuery.value.isPending).toBe(false);
    expect(myQuery.value.data).toEqual(10);
    expect(myQuery.value.error).toEqual(null);

    const myMutation = mutation(
      () => ({
        mutationFn: async () => {
          await sleep(100);
          return 50;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey });
        },
      }),
      () => queryClient,
    );

    const resultPromise = myMutation.value.mutate();

    expect(myMutation.value.isSuccess).toBe(false);
    expect(myMutation.value.isPending).toBe(true);
    expect(myMutation.value.data).toEqual(undefined);
    expect(myMutation.value.error).toEqual(null);

    expect(myQuery.value.isFetching).toBe(false);
    expect(myQuery.value.isSuccess).toBe(true);
    expect(myQuery.value.isLoading).toBe(false);
    expect(myQuery.value.isPending).toBe(false);
    expect(myQuery.value.data).toEqual(10);
    expect(myQuery.value.error).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myMutation.value.isSuccess).toBe(true);
    expect(myMutation.value.isPending).toBe(false);
    expect(myMutation.value.data).toEqual(50);
    expect(myMutation.value.error).toEqual(null);

    const result = await resultPromise;
    expect(result).toEqual(50);

    expect(myQuery.value.isFetching).toBe(true);
    expect(myQuery.value.isSuccess).toBe(true);
    expect(myQuery.value.isLoading).toBe(false);
    expect(myQuery.value.isPending).toBe(false);
    expect(myQuery.value.data).toEqual(10);
    expect(myQuery.value.error).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myMutation.value.isSuccess).toBe(true);
    expect(myMutation.value.isPending).toBe(false);
    expect(myMutation.value.data).toEqual(50);
    expect(myMutation.value.error).toEqual(null);

    expect(myQuery.value.isFetching).toBe(false);
    expect(myQuery.value.isSuccess).toBe(true);
    expect(myQuery.value.isLoading).toBe(false);
    expect(myQuery.value.isPending).toBe(false);
    expect(myQuery.value.data).toEqual(11);
    expect(myQuery.value.error).toEqual(null);
  });
});
