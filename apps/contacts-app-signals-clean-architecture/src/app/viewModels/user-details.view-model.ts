import {
  computed,
  effect,
  ReadonlySignal,
  signal
} from "@preact/signals-core";
import { User, UserVersion } from "contacts-app-core";
import { LoadUserQuery } from "../core/commands/load-user.query";
import { derived } from "../lib/signals";
import { FetchUserQueryResult } from "../core/dto";
import { QueryResult } from "../core/types";



export type UsersDetailsViewModelDependencies = {
  loadUserQuery: LoadUserQuery;
};

export class UsersDetailsViewModel {
  searchQuery = signal<string>("");
  draft = signal<UserVersion | null>(null);
  selectedVersion = signal<string>("");
  private _loadUserQueryResult: QueryResult<FetchUserQueryResult | undefined>;

  constructor(
    dependencies: UsersDetailsViewModelDependencies,
    userId: number
  ) {
    // Queries
    this._loadUserQueryResult = derived( () => dependencies.loadUserQuery.execute(userId))

     // One‑time init: set from first fetched value
    effect(() => {

      if(this.userVersions.value?.length){
        this.selectedVersion.value = this.userVersions.value?.[0].id;
      }

      if (this.drafts.value?.length) {
        this.draft.value = this.drafts.value?.find(d => d.id === this.selectedVersion.value) || null;
      }
    });

    
  }

  public get publishedUser(): ReadonlySignal<User | undefined> {
    return computed(() => (this._loadUserQueryResult.data.value?.publishedUser || undefined));
  }
  public get drafts(): ReadonlySignal<UserVersion[] | undefined> {
    return computed(() => (this._loadUserQueryResult.data.value?.userVersions.filter((v) => v.isDraft) || []));
  }

  public get userVersions(): ReadonlySignal<UserVersion[] | undefined> {
    return computed(() => this._loadUserQueryResult.data.value?.userVersions);
  }

  public isLoading = computed(() => this._loadUserQueryResult.isLoading.value);
  public isError = computed(() => !this._loadUserQueryResult.error?.value);

}