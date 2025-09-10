import { QueryClient } from '@tanstack/react-query';
import { User, UsersApiService, IUsersRepository } from 'contacts-app-core';

import { SignalCollection } from '../../lib/signals-collections';
import { computed } from '@preact/signals-core';

export interface UsersRepositoryDependencies {
  usersService: UsersApiService;
}

export class UsersRepository implements IUsersRepository {
  public readonly _usersCollection: SignalCollection<User>;

  constructor(
    queryClient: QueryClient,
    private dependencies: UsersRepositoryDependencies
  ) {
    this._usersCollection = new SignalCollection<User>(
      'users',
      ['users-list'],
      async () => await dependencies.usersService.fetchUsers(),
      queryClient,
      {
        onDelete: (id) => console.log('Deleted user', id),
      }
    );
  }

  public get isReady() {
    return computed(() => this._usersCollection.queryResult.value.isFetched);
  }

  async fetchById(id: number): Promise<User | undefined> {
    const isCollectionReady = this._usersCollection.queryResult.value.isFetched;
    let userToFetch = this._usersCollection.items.value.find((user) => user.id === id);

    if(!userToFetch && isCollectionReady){
      userToFetch =  await this.dependencies.usersService.fetchUser(id);
      this._usersCollection.insert(userToFetch);
    }

    return Promise.resolve(userToFetch);
  }
  getAll(): Promise<User[]> {
    return Promise.resolve(this._usersCollection.items.value);
  }
  insert(user: User): Promise<User> {
    this._usersCollection.insert(user);
    return Promise.resolve(user);
  }
  update(user: User): Promise<User> {
    this._usersCollection.update(user);
    return Promise.resolve(user);
  }
  delete(id: number): Promise<void> {
    return Promise.resolve(this._usersCollection.delete(id));
  }
}
