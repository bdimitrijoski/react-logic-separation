import { QueryClient } from '@tanstack/react-query';
import { DraftVersionsService, UserVersion } from 'contacts-app-core';
import { IDraftsRepository } from '../../core/repositories';
import { SignalCollection } from '../../lib/signals-collections';
import { computed } from '@preact/signals-core';

export interface DraftsRepositoryDependencies {
  draftsService: DraftVersionsService;
}

export class DraftsRepository implements IDraftsRepository {
  public readonly _draftsCollection: SignalCollection<UserVersion>;

  constructor(
    queryClient: QueryClient,
    private dependencies: DraftsRepositoryDependencies
  ) {
    this._draftsCollection = new SignalCollection<UserVersion>(
      'drafts',
      ['user-drafts'],
      async () => {
        const drafts = await dependencies.draftsService.getAll();
        console.log('Fetching drafts from API service...', drafts);
        return drafts;
      },
      queryClient,
      {
        onDelete: (id) => console.log('Deleted draft', id),
      }
    );
  }

  public get isReady() {
    return computed(() => this._draftsCollection.queryResult.value.isFetched);
  }

  getDraftsForUser(userId: number): Promise<UserVersion[]> {
    return Promise.resolve(
      this._draftsCollection.items.value.filter((d) => d.data.id === userId)
    );
  }

  getAll(): Promise<UserVersion[]> {
    return Promise.resolve(this._draftsCollection.items.value);
  }

  getAllSync(): UserVersion[] {
    return this._draftsCollection.items.value;
  }

  insert(draft: UserVersion): Promise<UserVersion> {
    this._draftsCollection.insert(draft);
    return Promise.resolve(draft);
  }
  update(draft: UserVersion): Promise<UserVersion> {
    this._draftsCollection.update(draft);
    return Promise.resolve(draft);
  }
  delete(id: string): Promise<void> {
    return Promise.resolve(this._draftsCollection.delete(id));
  }
}
