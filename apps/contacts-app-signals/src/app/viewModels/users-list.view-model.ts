import {
    computed,
    ReadonlySignal,
    signal
} from "@preact/signals-core";
import { QueryClient } from "@tanstack/query-core";
import { DraftVersionsService, User, UsersApiService, UserVersion } from "contacts-app-core";
import { query, SignalQuery } from "../lib/query";


export type UsersListViewModelDependencies = {
  usersService: UsersApiService;
  draftsService: DraftVersionsService;
};

export class UsersListViewModel {
  searchQuery = signal<string>("");

  private _fetchUsersQuery: SignalQuery<User[]>;
  private _fetchDraftsQuery: SignalQuery<UserVersion[]>;

  constructor(
    private queryClient: QueryClient = queryClient,
    dependencies: UsersListViewModelDependencies,
  ) {
    // Queries
    this._fetchUsersQuery = query<User[]>(
      () => ({
        queryKey: ["users-list"],
        queryFn: async () => await dependencies.usersService.fetchUsers()
      }),
      () => this.queryClient,
    );
    this._fetchDraftsQuery = query<UserVersion[]>(
      () => ({
        queryKey: ["user-drafts"],
        queryFn: async () => await dependencies.draftsService.getAllDraftsSync()
      }),
      () => this.queryClient,
    );
  }

  public get users(): ReadonlySignal<User[] | undefined> {
    return computed(() => this._fetchUsersQuery.value.data);
  }

  public getCombinedFilteredUsers = computed(() => {

    const combinedList: User[] = [
      ...(this._fetchDraftsQuery.value.data?.map((d) => d.data) || []),
      ...(this._fetchUsersQuery.value.data || []),
    ];
    return combinedList.filter((user) =>
      user.name.toLocaleLowerCase().startsWith(this.searchQuery.value.toLocaleLowerCase()),
    );
  });

  public isLoading = computed(() => this._fetchUsersQuery.value.isFetching);


  setSearchQuery(query: string) {
    this.searchQuery.value = query;
  }
}