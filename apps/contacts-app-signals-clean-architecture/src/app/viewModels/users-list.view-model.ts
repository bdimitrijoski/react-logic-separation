import { computed, signal } from '@preact/signals-core';
import type {
  User,
  QueryResultSignal,
  FetchUsersQuery,
  CreateDraftUserCommand,
  DeleteDraftUserCommand,
} from 'contacts-app-core';

import { derived } from '../lib/signals';

export type UsersListViewModelDependencies = {
  fetchUsersQuery: FetchUsersQuery;
  createDraftUser: CreateDraftUserCommand;
  deleteDraftUserCommand: DeleteDraftUserCommand;
};

/**
 * The view model is like a glue between the view and the domain/data layers.
 * It uses/orchestrates the commands/queries/repositories to get the data and expose it to the view.
 */
export class UsersListViewModel {
  searchQuery = signal<string>('');
  page = signal<number>(1);
  usersQueryResult: QueryResultSignal<User[] | undefined>;

  constructor(private dependencies: UsersListViewModelDependencies) {
    this.usersQueryResult = derived(() =>
      dependencies.fetchUsersQuery.execute(
        this.searchQuery.value,
        this.page.value
      )
    );
  }

  public get users() {
    return computed(() => this.usersQueryResult.data.value || []);
  }

  public get isLoading() {
    return computed(() => this.usersQueryResult.isLoading.value);
  }

  setSearchQuery(query: string) {
    this.searchQuery.value = query;
  }

  async createNewDraftUser() {
    const createdUser = await this.dependencies.createDraftUser.execute();
    return createdUser;
  }
  async deleteDraftUser(user: User) {
    await this.dependencies.deleteDraftUserCommand.execute({ user });
  }
  loadMoreUsers() {
    this.page.value = this.page.value + 1;
  }
}
