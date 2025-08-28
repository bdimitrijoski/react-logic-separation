import { computed, effect, signal } from "@preact/signals-core";
import {
  arrayEffect,
  debounced,
  derived,
  mapSignalArray,
  previous,
  relay,
} from "./signals";

import { isEqual } from "lodash";
import { sleep } from "./utils";

describe("mapSignalArray", () => {
  it("should work for primitives", () => {
    const ids = signal(["a", "b", "c"]);
    const effectInitialized = vi.fn();
    const effectDisposed = vi.fn();

    const disposalFns = mapSignalArray(
      ids,
      (id) => {
        return effect(() => {
          effectInitialized(id);

          return () => {
            effectDisposed(id);
          };
        });
      },
      (dispose) => {
        dispose();
      },
    );

    expect(effectDisposed).toBeCalledTimes(0);
    expect(effectInitialized).toBeCalledTimes(3);
    expect(effectInitialized).toBeCalledWith("a");
    expect(effectInitialized).toBeCalledWith("b");
    expect(effectInitialized).toBeCalledWith("c");

    ids.value = ["a", "b", "d"];

    expect(effectDisposed).toBeCalledTimes(1);
    expect(effectDisposed).toBeCalledWith("c");
    expect(effectInitialized).toBeCalledTimes(4);
    expect(effectInitialized).toBeCalledWith("d");

    ids.value = ["a", "b", "d"];
    expect(effectInitialized).toBeCalledTimes(4);
    expect(effectDisposed).toBeCalledTimes(1);

    ids.value = ["a", "b", "d"];
    expect(effectInitialized).toBeCalledTimes(4);
    expect(effectDisposed).toBeCalledTimes(1);

    ids.value = ["a", "b", "d", "e"];
    expect(effectDisposed).toBeCalledTimes(1);
    expect(effectInitialized).toBeCalledTimes(5);
    expect(effectInitialized).toBeCalledWith("e");

    disposalFns.value.forEach((dispose) => dispose());
    expect(effectInitialized).toBeCalledTimes(5);
    expect(effectDisposed).toBeCalledTimes(5);
    expect(effectDisposed).toBeCalledWith("a");
    expect(effectDisposed).toBeCalledWith("b");
    expect(effectDisposed).toBeCalledWith("d");
    expect(effectDisposed).toBeCalledWith("e");
  });

  it("should only call map function once per new element", () => {
    const ids = signal(["a", "b", "c"]);

    const mapUserId = vi.fn((id) => {
      return `user-${id}`;
    });

    const mappedUserIds = mapSignalArray(ids, mapUserId);

    expect(mapUserId).toBeCalledTimes(3);
    expect(mappedUserIds.value).toEqual(["user-a", "user-b", "user-c"]);

    ids.value = ["a", "b", "d"];

    expect(mapUserId).toBeCalledTimes(4);
    expect(mappedUserIds.value).toEqual(["user-a", "user-b", "user-d"]);

    ids.value = ["a", "b", "d", "e"];

    expect(mapUserId).toBeCalledTimes(5);
    expect(mappedUserIds.value).toEqual([
      "user-a",
      "user-b",
      "user-d",
      "user-e",
    ]);
  });

  it("should work for objects when using (default) referential equality for comparison", () => {
    const ids = signal([{ id: "a" }, { id: "b" }, { id: "c" }]);
    const effectInitialized = vi.fn();
    const effectDisposed = vi.fn();

    const disposalFns = mapSignalArray(
      ids,
      ({ id }) => {
        return effect(() => {
          effectInitialized(id);

          return () => {
            effectDisposed(id);
          };
        });
      },
      (dispose) => {
        dispose();
      },
    );

    expect(effectDisposed).toBeCalledTimes(0);
    expect(effectInitialized).toBeCalledTimes(3);
    expect(effectInitialized).toBeCalledWith("a");
    expect(effectInitialized).toBeCalledWith("b");
    expect(effectInitialized).toBeCalledWith("c");

    ids.value = [ids.value[0], ids.value[1], { id: "d" }];

    expect(effectDisposed).toBeCalledTimes(1);
    expect(effectDisposed).toBeCalledWith("c");
    expect(effectInitialized).toBeCalledTimes(4);
    expect(effectInitialized).toBeCalledWith("d");

    ids.value = ids.value.slice();
    expect(effectInitialized).toBeCalledTimes(4);
    expect(effectDisposed).toBeCalledTimes(1);

    ids.value = ids.value.slice();
    expect(effectInitialized).toBeCalledTimes(4);
    expect(effectDisposed).toBeCalledTimes(1);

    ids.value = [...ids.value.slice(), { id: "e" }];
    expect(effectDisposed).toBeCalledTimes(1);
    expect(effectInitialized).toBeCalledTimes(5);
    expect(effectInitialized).toBeCalledWith("e");

    disposalFns.value.forEach((dispose) => dispose());
    expect(effectInitialized).toBeCalledTimes(5);
    expect(effectDisposed).toBeCalledTimes(5);
    expect(effectDisposed).toBeCalledWith("a");
    expect(effectDisposed).toBeCalledWith("b");
    expect(effectDisposed).toBeCalledWith("d");
    expect(effectDisposed).toBeCalledWith("e");
  });

  it("should work for objects when using custom (deep-equal) comparison", () => {
    const ids = signal([{ id: "a" }, { id: "b" }, { id: "c" }]);
    const effectInitialized = vi.fn();
    const effectDisposed = vi.fn();

    const disposalFns = mapSignalArray(
      ids,
      ({ id }) => {
        return effect(() => {
          effectInitialized(id);

          return () => {
            effectDisposed(id);
          };
        });
      },
      (dispose) => {
        dispose();
      },
      isEqual,
    );

    expect(effectDisposed).toBeCalledTimes(0);
    expect(effectInitialized).toBeCalledTimes(3);
    expect(effectInitialized).toBeCalledWith("a");
    expect(effectInitialized).toBeCalledWith("b");
    expect(effectInitialized).toBeCalledWith("c");

    ids.value = [{ id: "a" }, { id: "b" }, { id: "d" }];

    expect(effectDisposed).toBeCalledTimes(1);
    expect(effectDisposed).toBeCalledWith("c");
    expect(effectInitialized).toBeCalledTimes(4);
    expect(effectInitialized).toBeCalledWith("d");

    ids.value = [{ id: "a" }, { id: "b" }, { id: "d" }];
    expect(effectInitialized).toBeCalledTimes(4);
    expect(effectDisposed).toBeCalledTimes(1);

    ids.value = [{ id: "a" }, { id: "b" }, { id: "d" }];
    expect(effectInitialized).toBeCalledTimes(4);
    expect(effectDisposed).toBeCalledTimes(1);

    ids.value = [{ id: "a" }, { id: "b" }, { id: "d" }, { id: "e" }];
    expect(effectDisposed).toBeCalledTimes(1);
    expect(effectInitialized).toBeCalledTimes(5);
    expect(effectInitialized).toBeCalledWith("e");

    disposalFns.value.forEach((dispose) => dispose());
    expect(effectInitialized).toBeCalledTimes(5);
    expect(effectDisposed).toBeCalledTimes(5);
    expect(effectDisposed).toBeCalledWith("a");
    expect(effectDisposed).toBeCalledWith("b");
    expect(effectDisposed).toBeCalledWith("d");
    expect(effectDisposed).toBeCalledWith("e");
  });
});

describe("arrayEffect", () => {
  it("should work", () => {
    const ids = signal(["a", "b", "c"]);

    const upperCasedIds = computed(() => {
      const idsValue = ids.value;
      return idsValue.map((id) => id.toUpperCase());
    });

    expect(upperCasedIds.value).toEqual(["A", "B", "C"]);
  });

  it("should also work", () => {
    const ids = signal(["a", "b", "c"]);
    const effectInitialized = vi.fn();
    const effectDisposed = vi.fn();

    const disposeArrayEffect = arrayEffect(ids, (id) => {
      effectInitialized(id);

      return () => {
        effectDisposed(id);
      };
    });

    expect(effectDisposed).toBeCalledTimes(0);
    expect(effectInitialized).toBeCalledTimes(3);
    expect(effectInitialized).toBeCalledWith("a");
    expect(effectInitialized).toBeCalledWith("b");
    expect(effectInitialized).toBeCalledWith("c");

    ids.value = ["a", "b", "d"];

    expect(effectDisposed).toBeCalledTimes(1);
    expect(effectDisposed).toBeCalledWith("c");
    expect(effectInitialized).toBeCalledTimes(4);
    expect(effectInitialized).toBeCalledWith("d");

    ids.value = ["a", "b", "d"];
    expect(effectInitialized).toBeCalledTimes(4);
    expect(effectDisposed).toBeCalledTimes(1);

    ids.value = ["a", "b", "d"];
    expect(effectInitialized).toBeCalledTimes(4);
    expect(effectDisposed).toBeCalledTimes(1);

    ids.value = ["a", "b", "d", "e"];
    expect(effectDisposed).toBeCalledTimes(1);
    expect(effectInitialized).toBeCalledTimes(5);
    expect(effectInitialized).toBeCalledWith("e");

    disposeArrayEffect();
    expect(effectInitialized).toBeCalledTimes(5);
    expect(effectDisposed).toBeCalledTimes(5);
    expect(effectDisposed).toBeCalledWith("a");
    expect(effectDisposed).toBeCalledWith("b");
    expect(effectDisposed).toBeCalledWith("d");
    expect(effectDisposed).toBeCalledWith("e");
  });
});

describe("relay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should initialize correctly", () => {
    // arrange
    const timeoutInMs = 1000;

    const [myRelaySignal] = relay(0, (set) => {
      setTimeout(() => {
        set(10);
      }, timeoutInMs);
    });

    // assert
    expect(myRelaySignal.value).toEqual(0);

    // act
    vi.advanceTimersByTime(timeoutInMs);

    // assert
    expect(myRelaySignal.value).toEqual(10);
  });

  it("should set from the outside correctly", () => {
    // arrange
    const timeoutInMs = 1000;

    const [myRelaySignal, setMyRelaySignal] = relay(0, (set) => {
      setTimeout(() => {
        set(10);
      }, timeoutInMs);
    });

    // assert
    expect(myRelaySignal.value).toEqual(0);

    // act
    setMyRelaySignal(5);

    // assert
    expect(myRelaySignal.value).toEqual(5);

    // act
    vi.advanceTimersByTime(timeoutInMs);

    // assert
    expect(myRelaySignal.value).toEqual(10);
  });

  it("should dispose from outside correctly", () => {
    // arrange
    const intervalInMs = 1000;

    const [myRelaySignal, setMyRelaySignal, disposeMyRelaySignal] = relay(
      0,
      (set, get) => {
        const myInterval = setInterval(() => {
          set(get() + 1);
        }, intervalInMs);

        return () => {
          clearTimeout(myInterval);
        };
      },
    );

    // assert
    expect(myRelaySignal.value).toEqual(0);

    // act
    setMyRelaySignal(5);

    // assert
    expect(myRelaySignal.value).toEqual(5);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(6);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(7);

    // act
    disposeMyRelaySignal();

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(7);
  });

  it("should continue to update correctly", () => {
    // arrange
    const intervalInMs = 1000;

    const [myRelaySignal] = relay(0, (set, get) => {
      setInterval(() => {
        set(get() + 1);
      }, intervalInMs);
    });

    // assert
    expect(myRelaySignal.value).toEqual(0);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(1);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(2);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(3);
  });

  it("should trigger on dependency changes correctly", () => {
    // arrange
    const intervalInMs = 1000;
    const mySignal = signal(0);

    const [myRelaySignal] = relay(0, (set, get) => {
      const signalValue = mySignal.value;
      set(signalValue);

      const relayInterval = setInterval(() => {
        set(get() + 1);
      }, intervalInMs);

      return () => {
        clearInterval(relayInterval);
      };
    });

    // assert
    expect(myRelaySignal.value).toEqual(0);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(1);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(2);

    // act
    mySignal.value = 10;

    // assert
    expect(myRelaySignal.value).toEqual(10);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(11);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(12);
  });
});

describe("previous", () => {
  it("should contain previous value of input signal", () => {
    // arrange
    const mySignal = signal(1);
    const myPreviousSignal = previous(mySignal);

    // assert
    expect(mySignal.value).toEqual(1);
    expect(myPreviousSignal.value).toEqual(1);

    // act
    mySignal.value = 2;

    // assert
    expect(mySignal.value).toEqual(2);
    expect(myPreviousSignal.value).toEqual(1);

    // act
    mySignal.value = 3;

    // assert
    expect(mySignal.value).toEqual(3);
    expect(myPreviousSignal.value).toEqual(2);
  });
});

describe("debounced", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should update value only at debounce time", () => {
    // arrange
    const debounceTime = 1000;
    const mySignal = signal(1);
    const myDebouncedSignal = debounced(mySignal, debounceTime);

    // assert
    expect(mySignal.value).toEqual(1);
    expect(myDebouncedSignal.value).toEqual(1);

    // act
    mySignal.value = 2;

    // assert
    expect(mySignal.value).toEqual(2);
    expect(myDebouncedSignal.value).toEqual(1);

    // act
    vi.advanceTimersByTime(debounceTime);

    // assert
    expect(mySignal.value).toEqual(2);
    expect(myDebouncedSignal.value).toEqual(2);
  });

  it("should debounce on consecutive changes within debounce time", () => {
    // arrange
    const debounceTime = 1000;
    const mySignal = signal(1);
    const myDebouncedSignal = debounced(mySignal, debounceTime);

    // assert
    expect(mySignal.value).toEqual(1);
    expect(myDebouncedSignal.value).toEqual(1);

    // act
    mySignal.value = 2;

    // assert
    expect(mySignal.value).toEqual(2);
    expect(myDebouncedSignal.value).toEqual(1);

    // act
    vi.advanceTimersByTime(debounceTime - 1);

    // assert
    expect(mySignal.value).toEqual(2);
    expect(myDebouncedSignal.value).toEqual(1);

    // act
    mySignal.value = 3;

    // assert
    expect(mySignal.value).toEqual(3);
    expect(myDebouncedSignal.value).toEqual(1);

    // act
    vi.advanceTimersByTime(debounceTime - 1);

    // assert
    expect(mySignal.value).toEqual(3);
    expect(myDebouncedSignal.value).toEqual(1);

    // act
    mySignal.value = 4;

    // assert
    expect(mySignal.value).toEqual(4);
    expect(myDebouncedSignal.value).toEqual(1);

    // act
    vi.advanceTimersByTime(debounceTime - 1);

    // assert
    expect(mySignal.value).toEqual(4);
    expect(myDebouncedSignal.value).toEqual(1);

    // act
    vi.advanceTimersByTime(debounceTime);

    // assert
    expect(mySignal.value).toEqual(4);
    expect(myDebouncedSignal.value).toEqual(4);
  });
});

describe("derived", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  it("should initialize and resolve correctly (promise)", async () => {
    const myDerived = derived(() => Promise.resolve(10));

    expect(myDerived.isLoading.value).toBe(true);
    expect(myDerived.data.value).toEqual(undefined);
    expect(myDerived.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myDerived.isLoading.value).toBe(false);
    expect(myDerived.data.value).toEqual(10);
    expect(myDerived.error.value).toEqual(null);
  });

  it("should initialize and resolve correctly (async)", async () => {
    const myDerived = derived(async () => 10);

    expect(myDerived.isLoading.value).toBe(true);
    expect(myDerived.data.value).toEqual(undefined);
    expect(myDerived.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myDerived.isLoading.value).toBe(false);
    expect(myDerived.data.value).toEqual(10);
    expect(myDerived.error.value).toEqual(null);
  });

  it("should update according to dependencies", async () => {
    const mySignal = signal(10);
    const myDerived = derived(async () => mySignal.value);

    expect(myDerived.isLoading.value).toBe(true);
    expect(myDerived.data.value).toEqual(undefined);
    expect(myDerived.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myDerived.isLoading.value).toBe(false);
    expect(myDerived.data.value).toEqual(10);
    expect(myDerived.error.value).toEqual(null);

    mySignal.value = 20;

    expect(myDerived.isLoading.value).toBe(true);
    expect(myDerived.data.value).toEqual(10);
    expect(myDerived.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myDerived.isLoading.value).toBe(false);
    expect(myDerived.data.value).toEqual(20);
    expect(myDerived.error.value).toEqual(null);
  });

  it("should handle aborting", async () => {
    const mySignal = signal(10);
    const abort = vi.fn();
    const myDerived = derived(async (abortSignal) => {
      const result = mySignal.value;

      await sleep(100);

      if (abortSignal.aborted) {
        return abort();
      }

      return result;
    });

    expect(myDerived.isLoading.value).toBe(true);
    expect(myDerived.data.value).toEqual(undefined);
    expect(myDerived.error.value).toEqual(null);
    expect(abort).toBeCalledTimes(0);

    await vi.advanceTimersToNextTimerAsync();

    expect(myDerived.isLoading.value).toBe(false);
    expect(myDerived.data.value).toEqual(10);
    expect(myDerived.error.value).toEqual(null);
    expect(abort).toBeCalledTimes(0);

    mySignal.value = 20;

    expect(myDerived.isLoading.value).toBe(true);
    expect(myDerived.data.value).toEqual(10);
    expect(myDerived.error.value).toEqual(null);
    expect(abort).toBeCalledTimes(0);

    await vi.advanceTimersToNextTimerAsync();

    expect(myDerived.isLoading.value).toBe(false);
    expect(myDerived.data.value).toEqual(20);
    expect(myDerived.error.value).toEqual(null);
    expect(abort).toBeCalledTimes(0);

    mySignal.value = 30;

    expect(myDerived.isLoading.value).toBe(true);
    expect(myDerived.data.value).toEqual(20);
    expect(myDerived.error.value).toEqual(null);
    expect(abort).toBeCalledTimes(0);

    mySignal.value = 40;

    expect(myDerived.isLoading.value).toBe(true);
    expect(myDerived.data.value).toEqual(20);
    expect(myDerived.error.value).toEqual(null);
    expect(abort).toBeCalledTimes(0);

    await vi.advanceTimersToNextTimerAsync();

    expect(myDerived.isLoading.value).toBe(true);
    expect(myDerived.data.value).toEqual(20);
    expect(myDerived.error.value).toEqual(null);
    expect(abort).toBeCalledTimes(1);

    await vi.advanceTimersToNextTimerAsync();

    expect(myDerived.isLoading.value).toBe(false);
    expect(myDerived.data.value).toEqual(40);
    expect(myDerived.error.value).toEqual(null);
    expect(abort).toBeCalledTimes(1);
  });
});
