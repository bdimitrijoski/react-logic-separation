import { UserVersionFactory } from 'contacts-app-core';
import {
    draftUserMock,
    publishedUserMock
} from '../../__mocks__/mockData';
import { createDraftUserMock, deleteDraftUserCommandMock, draftVersionsServiceMock, fetchUsersQueryMock, usersServiceMock } from '../../__mocks__/mockServices';
import { queryClient } from '../../queryClient';
import { CreateDraftUserCommand } from '../core/commands/create-draft-user.command';
import { FetchUsersQuery } from '../core/commands/fetch-users.query';
import { DraftsRepository } from '../infrastructure/repositories/drafts-repository';
import { UsersRepository } from '../infrastructure/repositories/users-repository';
import { UsersListViewModel } from './users-list.view-model';

describe('UsersListViewModel', () => {
  
  afterAll(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('should initialize correctly', async () => {
    const usersModel = new UsersListViewModel({
      fetchUsersQuery: fetchUsersQueryMock,
      createDraftUser: createDraftUserMock,
      deleteDraftUserCommand: deleteDraftUserCommandMock,
    });
    expect(usersModel).toBeTruthy();
    expect(usersModel.users.value).toEqual([]);
    await vi.waitFor(() => expect(usersModel.isLoading.value).toBe(true));
    await vi.waitFor(() => expect(usersModel.isLoading.value).toBe(false));
    expect(usersModel.users.value).toEqual(expect.arrayContaining([publishedUserMock, draftUserMock]));
  });

  it('should re-run the fetchUsersQuery when searching for users', async () => {
    const usersModel = new UsersListViewModel({
      fetchUsersQuery: fetchUsersQueryMock,
      createDraftUser: createDraftUserMock,
      deleteDraftUserCommand: deleteDraftUserCommandMock,
    });
    await vi.waitFor(() => expect(usersModel.isLoading.value).toBe(true));
    await vi.waitFor(() => expect(usersModel.isLoading.value).toBe(false));
    expect(usersModel.users.value.length).toEqual(2);

    usersModel.setSearchQuery('John');
    await vi.waitFor(() => expect(usersModel.isLoading.value).toBe(true));
    await vi.waitFor(() => expect(usersModel.isLoading.value).toBe(false));
    expect(usersModel.users.value).toEqual([publishedUserMock]);
  });

  it('should update the user list when a new draft is created', async () => {
    // const queryClient = new QueryClient();
    const draftsRepositoryWithSignals = new DraftsRepository(queryClient, {
      draftsService: draftVersionsServiceMock,
    });

    const usersRepositoryWithSignals = new UsersRepository(queryClient, {
        usersService: usersServiceMock
    })
    const fetchUsersQueryWithSignals = new FetchUsersQuery(
      usersRepositoryWithSignals,
      draftsRepositoryWithSignals
    );

    const userFactoryService = new UserVersionFactory();
    const createDraftUserCommandWithSignals = new CreateDraftUserCommand(userFactoryService, draftsRepositoryWithSignals);

    const usersModel = new UsersListViewModel({
      fetchUsersQuery: fetchUsersQueryWithSignals,
      createDraftUser: createDraftUserCommandWithSignals,
      deleteDraftUserCommand: deleteDraftUserCommandMock,
    });

    await vi.waitFor(() => expect(usersModel.isLoading.value).toBe(true));

    await vi.waitFor(() => expect(usersModel.isLoading.value).toBe(false));
    expect(usersModel.users.value.length).toEqual(2);

    expect(usersModel.users.value).toEqual(
      expect.arrayContaining([publishedUserMock, draftUserMock])
    );

    usersModel.createNewDraftUser();
    // make sure that the userQuery is being re-fetched
    await vi.waitFor(() => expect(usersModel.usersQueryResult.isLoading.value).toBe(true));
    await vi.waitFor(() => expect(usersModel.usersQueryResult.isLoading.value).toBe(false));
    await vi.waitFor(() => expect(usersModel.users.value.length).toBe(3));
  });
});
