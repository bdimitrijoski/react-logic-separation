import { User, UserVersion, QueryResult } from "../types";

export interface IUsersRepository {
    searchUsers(searchQuery: string): Promise<QueryResult<User[]>>;
}
export interface IDraftsRepository {
    getAllDrafts(): Promise<QueryResult<UserVersion[]>>;
}