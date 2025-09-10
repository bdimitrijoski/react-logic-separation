import { User, UserVersion } from "contacts-app-core";
import { IRepository } from "../types";

export interface IUsersRepository extends IRepository<User, number> {
  fetchById(id: number): Promise<User | undefined>;
}

export interface IDraftsRepository extends IRepository<UserVersion, string> {
  getDraftsForUser(userId: number): Promise<UserVersion[]>;
  getDraftsForUserSync(userId: number): UserVersion[];
  getAllSync(): UserVersion[];
  deleteDraftsForUser(userId: number): Promise<void>;
}