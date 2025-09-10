import { computed, effect, ReadonlySignal, signal } from '@preact/signals-core';
import type {
  User,
  UserVersion,
  IViewModel,
  QueryResultSignal,
  FetchUserQueryResult,
  CreateDraftUserCommand,
  LoadUserQuery,
  DeleteDraftUserCommand,
} from 'contacts-app-core';

import { derived } from '../lib/signals';

export type UsersDetailsViewModelDependencies = {
  loadUserQuery: LoadUserQuery;
  createDraftUser: CreateDraftUserCommand;
  deleteDraftUserCommand: DeleteDraftUserCommand;
};

/**
 * The view model is like a glue between the view and the domain/data layers.
 * It uses/orchestrates the commands/queries/repositories to get the data and expose it to the view.
 */
export class UsersDetailsViewModel implements IViewModel {
  draft = signal<UserVersion | null>(null);
  selectedVersion = signal<string>('');
  _loadUserQueryResult: QueryResultSignal<FetchUserQueryResult | undefined>;

  private _disposables: Array<() => void> = [];

  constructor(
    private dependencies: UsersDetailsViewModelDependencies,
    userId: number
  ) {
    // Queries
    this._loadUserQueryResult = derived(() =>
      dependencies.loadUserQuery.execute(userId)
    );

    // One‑time init: set from first fetched value
    const initEffect = effect(() => {
      if (this.userVersions.value?.length && !this.selectedVersion.value) {
        this.selectedVersion.value = this.userVersions.value?.[0].id;
      }

      if (this.drafts.value?.length) {
        this.draft.value =
          this.drafts.value?.find((d) => d.id === this.selectedVersion.value) ||
          null;
      }
    });

    // Store the effect cleanup function
    this._disposables.push(initEffect);
  }

  public get publishedUser(): ReadonlySignal<User | undefined> {
    return computed(
      () => this._loadUserQueryResult.data.value?.publishedUser || undefined
    );
  }
  public get drafts(): ReadonlySignal<UserVersion[] | undefined> {
    return computed(() => {
      return (
        this._loadUserQueryResult.data.value?.userVersions.filter(
          (v) => v.isDraft
        ) || []
      );
    });
  }

  public get userVersions(): ReadonlySignal<UserVersion[] | undefined> {
    return computed(() => this._loadUserQueryResult.data.value?.userVersions);
  }

  public isLoading = computed(() => this._loadUserQueryResult.isLoading.value);
  public isError = computed(() => !this._loadUserQueryResult.error?.value);

  async startEdit() {
    if (!this.publishedUser) return;
    const newVersion = await this.dependencies.createDraftUser.execute({
      user: this.publishedUser.value,
    });
    this.selectedVersion.value = newVersion.id;
  }

  updateUser(field: keyof User, value: string) {
    if (!this.draft.value) return;
    this.draft.value = {
      ...this.draft.value,
      data: { ...this.draft.value?.data, [field]: value },
    };
  }

  async discardDraft() {
    if (!this.draft.value || !this.userVersions.value) return;
    await this.dependencies.deleteDraftUserCommand.execute({
      user: this.draft.value?.data,
    });

    this.draft.value = null;
    this.selectedVersion.value = this.userVersions.value?.[0].id;
  }

  dispose(): void {
    // Call all stored cleanup functions
    this._disposables.forEach((disposeFn) => disposeFn());

    // Clear the arrays
    this._disposables = [];

    // Clean up the derived query results
    if (this._loadUserQueryResult && this._loadUserQueryResult.dispose) {
      this._loadUserQueryResult.dispose();
    }

    console.log('UsersDetailsViewModel disposed');
  }
}
