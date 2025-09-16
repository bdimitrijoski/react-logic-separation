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
  PublishDraftCommand,
} from 'contacts-app-core';

import { derived } from '../lib/signals';
import { createDraftUserCommand, deleteDraftUserCommand, loadUserQuery, publishDraftCommand } from '../services';

export type UsersDetailsViewModelDependencies = {
  loadUserQuery: LoadUserQuery;
  createDraftUser: CreateDraftUserCommand;
  deleteDraftUserCommand: DeleteDraftUserCommand;
  publishDraftCommand: PublishDraftCommand;
};
interface UsersDetailsViewModelProps {
  userId: number;
}

/**
 * The view model is like a glue between the view and the domain/data layers.
 * It uses/orchestrates the commands/queries/repositories to get the data and expose it to the view.
 */
export class UsersDetailsViewModel implements IViewModel<UsersDetailsViewModelProps> {
  draft = signal<UserVersion | null>(null);
  selectedVersion = signal<string>('');
  _loadUserQueryResult: QueryResultSignal<FetchUserQueryResult | undefined> | null = null;

  private _disposables: Array<() => void> = [];

  constructor(
    private dependencies: UsersDetailsViewModelDependencies
  ) {}

  initialize({ userId }: UsersDetailsViewModelProps): void {
// Queries
    this._loadUserQueryResult = derived(() =>
      this.dependencies.loadUserQuery.execute(userId)
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
      () => this._loadUserQueryResult?.data.value?.publishedUser || undefined
    );
  }
  public get drafts(): ReadonlySignal<UserVersion[] | undefined> {
    return computed(() => {
      return (
        this._loadUserQueryResult?.data.value?.userVersions.filter(
          (v) => v.isDraft
        ) || []
      );
    });
  }

  public get userVersions(): ReadonlySignal<UserVersion[] | undefined> {
    return computed(() => this._loadUserQueryResult?.data.value?.userVersions);
  }

  public isLoading = computed(() => this._loadUserQueryResult?.isLoading.value);
  public isError = computed(() => !this._loadUserQueryResult?.error?.value);

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

  async publishDraft() {
    if (!this.draft.value) return;
    console.log('Publishing', this.draft.value);
    await this.dependencies.publishDraftCommand.execute({
      version: this.draft.value,
      isNew: !this.publishedUser.value,
    });
    await this.discardDraft();
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
    this._loadUserQueryResult = null;
    this.draft.value = null;
    this.selectedVersion.value = '';

    console.log('UsersDetailsViewModel disposed');
  }
}

export const userDetailsModel = new UsersDetailsViewModel(
  {
    loadUserQuery,
    createDraftUser: createDraftUserCommand,
    deleteDraftUserCommand,
    publishDraftCommand
  }
);
