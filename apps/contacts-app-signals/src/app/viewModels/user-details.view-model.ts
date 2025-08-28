import {
    computed,
    effect,
    ReadonlySignal,
    signal
} from "@preact/signals-core";
import { QueryClient } from "@tanstack/query-core";
import { DraftVersionsService, User, UsersApiService, UserVersion, UserVersionFactory } from "contacts-app-core";
import { query, SignalQuery } from "../lib/query";
import { sign } from "crypto";


export type UsersDetailsViewModelDependencies = {
  usersService: UsersApiService;
  draftsService: DraftVersionsService;
  userFactoryService: UserVersionFactory
};

export class UsersDetailsViewModel {
  searchQuery = signal<string>("");
  draft = signal<UserVersion | null>(null);
  selectedVersion = signal<string>("");

  private _fetchPublishedUserQuery: SignalQuery<User | undefined>;
  private _fetchUserDraftsQuery: SignalQuery<UserVersion[]>;

  constructor(
    private queryClient: QueryClient = queryClient,
    private dependencies: UsersDetailsViewModelDependencies,
    userId: number
  ) {
    // Queries
    this._fetchPublishedUserQuery = query<User>(
      () => ({
        queryKey: ["user", userId],
        queryFn: async () => await dependencies.usersService.fetchUser(userId),
        initialData: () => {
          const users = this.queryClient.getQueryData<User[]>(["users-list"]);
          return users?.find((u) => u.id === userId);
        }
      }),
      () => this.queryClient,
    );
    this._fetchUserDraftsQuery = query<UserVersion[]>(
      () => ({
        queryKey: ["user-drafts", userId],
        queryFn: async () => await dependencies.draftsService.getDrafts(userId)
      }),
      () => this.queryClient,
    );

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
    return computed(() => (this._fetchPublishedUserQuery.value.data || undefined));
  }
  public get drafts(): ReadonlySignal<UserVersion[] | undefined> {
    return computed(() => (this._fetchUserDraftsQuery.value.data || []));
  }

  public get userVersions(): ReadonlySignal<UserVersion[] | undefined> {
    return computed(() => [
          ...(this._fetchPublishedUserQuery.value.data ? [this.dependencies.userFactoryService.createVersion(this._fetchPublishedUserQuery.value.data)] : []),
          ...(this._fetchUserDraftsQuery.value.data || []),
        ]);
  }

  public isLoading = computed(() => this._fetchPublishedUserQuery.value.isFetching || this._fetchUserDraftsQuery.value.isFetching);
  public isError = computed(() => this._fetchPublishedUserQuery.value.isError || this._fetchUserDraftsQuery.value.isError);

}