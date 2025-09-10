import { Signal } from "@preact/signals-core";

export type QueryResult<T> = {
    data: Signal<T>;
    isLoading: Signal<boolean>;
    error?: Signal<Error | string | null | unknown>;
    dispose?: () => void;
}


export interface IRepository<T, ID> {
  getAll(): Promise<T[]>;
  insert(item: T): Promise<T>;
  update(item: T): Promise<T>;
  delete(id: ID): Promise<void>;   
}

export interface IViewModel {
    dispose: () => void;
}