import { User, UsersApiService } from 'contacts-app-core';
import { SignalCollection } from '../../lib/signals-collections';
import { QueryClient } from '@tanstack/react-query';
import { computed, ReadonlySignal } from '@preact/signals-core';
import { IUsersRepository } from '../../core/repositories';
// import { ReadonlySignal } from '../../core/types';

export interface UsersRepositoryDependencies {
  usersService: UsersApiService;
}

export class UsersRepository implements IUsersRepository {
  public readonly _usersCollection: SignalCollection<User>;

  constructor(
    private queryClient: QueryClient,
    private dependencies: UsersRepositoryDependencies
  ) {
    this._usersCollection = new SignalCollection<User>(
      'users',
      ['users-list'],
      () => {
        console.log('Fetching users from API service...');
        return dependencies.usersService.fetchUsers();
      },
      queryClient,
      {
        onDelete: (id) => console.log('Deleted user', id),
      }
    );
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
  insert(item: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
  update(item: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public getAllUsers(): ReadonlySignal<User[]> {
    return this._usersCollection.items;
  }

  public filterUsers(searchQuery: string): ReadonlySignal<User[]> {
    return computed(() =>
      this._usersCollection.items.value.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  // Extra domain-specific repo methods
  async getOrFetchUser(id: number) {
    return this._usersCollection.fetchBy(id, () =>
      this.dependencies.usersService.fetchUser(id)
    );
  }

  createUser(user: User) {
    this._usersCollection.insert(user);
  }
}
