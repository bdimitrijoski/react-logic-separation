import { User, UserVersion } from "contacts-app-core";

export interface IRepository<T, ID> {
  getAll(): Promise<T[]>;
  insert(item: T): Promise<T>;
  update(item: T): Promise<T>;
  delete(id: ID): Promise<void>;   
}

export interface IUsersRepository extends IRepository<User, string> {
  fetchById(id: number): Promise<User | undefined>;
}

export interface IDraftsRepository extends IRepository<UserVersion, string> {
  getDraftsForUser(userId: number): Promise<UserVersion[]>;
  getAllSync(): UserVersion[];
}