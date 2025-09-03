import { computed, ReadonlySignal } from '@preact/signals';
import { QueryClient } from '@tanstack/react-query';
import { query, SignalQuery } from './query';

type ID = string | number;

interface Callbacks<T> {
  onInsert?: (item: T) => void;
  onUpdate?: (item: T) => void;
  onDelete?: (id: ID) => void;
  onFetchMiss?: (id: ID) => void;
}

export class SignalCollection<T extends { id: ID }> {
  public readonly queryResult: SignalQuery<T[] | undefined>;

  constructor(
    private readonly name: string, // e.g. "users"
    private readonly listKey: unknown[],
    private readonly listQueryFn: () => Promise<T[]>,
    private readonly queryClient: QueryClient,
    private readonly callbacks: Callbacks<T> = {}
  ) {
    this.queryResult = query<T[]>(
      () => ({
        queryKey: this.listKey,
        queryFn: this.listQueryFn,
        initialData: () => this.getCache(this.listKey) ?? [],
      }),
      () => this.queryClient
    );

    // reactively keep `items` in sync with the query result
    // this.queryResult.subscribe((result) => {
    //   if (result.data) {
    //     this.items.value = result.data;
    //   }
    // });
  }

  public get items(): ReadonlySignal<T[]> {
    return computed(() => this.queryResult.value.data || []);
  }
  public get isLoading(): ReadonlySignal<boolean> {
    return computed(() => this.queryResult.value.isLoading);
  }

  private getCache = <R = any>(key: unknown[]): R | undefined =>
    this.queryClient.getQueryData<R>(key);

  private setCache = <R = any>(key: unknown[], data: R) => {
    this.queryClient.setQueryData(key, data);
  };

  insert(item: T) {
    const updated = [...this.items.value, item];
    this.setCache(this.listKey, updated);
    this.callbacks.onInsert?.(item);
  }

  update(item: T) {
    const updated = this.items.value.map((i) => (i.id === item.id ? item : i));
    this.setCache(this.listKey, updated);
    this.callbacks.onUpdate?.(item);
  }

  delete(id: ID) {
    const updated = this.items.value?.filter((i) => i.id !== id);
    this.setCache(this.listKey, updated);
    this.callbacks.onDelete?.(id);
  }

  findById(id: ID): T | undefined {
    return this.items.value?.find((i) => i.id === id);
  }

  async fetchBy(id: ID, fetchFn: () => Promise<T>): Promise<T> {
    const found = this.findById(id);
    if (found) return found;

    this.callbacks.onFetchMiss?.(id);

    const item = await this.queryClient.fetchQuery<T>({
      queryKey: [this.name, id],
      queryFn: fetchFn,
      initialData: () => this.findById(id),
    });

    // merge into list cache
    const merged = [...this.items.value.filter((i) => i.id !== item.id), item];
    this.setCache(this.listKey, merged);

    return item;
  }
}
