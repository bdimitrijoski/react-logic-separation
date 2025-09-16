import { Signal } from '@preact/signals-core';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export interface UserVersion {
  id: string; // UUID or timestamp
  data: User;
  timestamp: number;
  isDraft: boolean;
}

export type QueryResult<T> = {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
};

export type QueryResultSignal<T> = {
  data: Signal<T>;
  isLoading: Signal<boolean>;
  error?: Signal<Error | string | null | unknown>;
  dispose?: () => void;
};

export interface IRepository<T, ID> {
  getAll(): Promise<T[]>;
  insert(item: T): Promise<T>;
  update(item: T): Promise<T>;
  delete(id: ID): Promise<void>;
}

export interface IViewModel<ViewModelProps> {
  initialize(args?: ViewModelProps): void;
  dispose: () => void;
}
