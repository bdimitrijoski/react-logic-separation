import { computed, signal } from '@preact/signals-core';
import { User } from 'contacts-app-core';
import type { FetchUsersQuery } from '../core/commands/fetch-users.query';
import type { QueryResult } from '../core/types';
import { derived } from '../lib/signals';
import type { CreateDraftUserCommand } from '../core/commands/create-draft-user.command';
import { DeleteDraftUserCommand } from '../core/commands/delete-draft-user.command';

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
  usersQueryResult: QueryResult<User[] | undefined>;

  constructor(private dependencies: UsersListViewModelDependencies) {
    this.usersQueryResult = derived(() =>
      dependencies.fetchUsersQuery.execute(this.searchQuery.value, this.page.value)
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
    await this.dependencies.createDraftUser.execute();
  }
  deleteDraftUser(user: User) {
    this.dependencies.deleteDraftUserCommand.execute({ user });
  }
  loadMoreUsers() {
    this.page.value = this.page.value +1;
  }
}
