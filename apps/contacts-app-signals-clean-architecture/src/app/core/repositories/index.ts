import { User } from "contacts-app-core";
import { ReadonlySignal, Signal } from "../types";

export interface IRepository<T, ID> {
  getAll(): Promise<T[]>;
//   getById(id: ID): ReadonlySignal<T | undefined>;
  insert(item: T): Promise<void>;
  update(item: T): Promise<void>;
  delete(id: ID): Promise<void>;   
}

export interface IUsersRepository extends IRepository<User, string> {
  filterUsers(searchQuery: string): ReadonlySignal<User[]>;
  fetchById(id: number): Promise<User | undefined>;
}