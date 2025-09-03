import {
  signal
} from "@preact/signals-core";
import { DraftVersionsService, User } from "contacts-app-core";
import { QueryResult } from "../core/types";
import { UsersRepository } from "../infrastructure/repositories/users-repository";
import { derived } from "../lib/signals";
import { CreateDraftUserCommand, fetchUsersQuery } from "../services";


export type UsersListViewModelDependencies = {
  usersRepository: UsersRepository;
  draftsService: DraftVersionsService;
  createDraftUser: CreateDraftUserCommand;
};

export class UsersListViewModel {
  searchQuery = signal<string>("");
  usersQueryResult: QueryResult<User[] | undefined>;

  constructor(
    private dependencies: UsersListViewModelDependencies,
  ) {
    this.usersQueryResult = derived(() => fetchUsersQuery.execute(this.searchQuery.value));
  }

  setSearchQuery(query: string) {
    this.searchQuery.value = query;
  }

  createNewDraftUser() {
    this.dependencies.createDraftUser.execute()
  }
}