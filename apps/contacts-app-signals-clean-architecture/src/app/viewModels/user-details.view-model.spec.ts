import {
  UserVersionFactory,
  CreateDraftUserCommand,
  FetchUsersQuery,
  DeleteDraftUserCommand,
  PublishDraftCommand,
} from 'contacts-app-core';
import { draftUserMock, publishedUserMock } from '../../__mocks__/mockData';
import {
  createDraftUserMock,
  deleteDraftUserCommandMock,
  draftVersionsServiceMock,
  fetchUsersQueryMock,
  loadUserQueryMock,
  publishDraftCommandMock,
  usersServiceMock,
  usersRepositoryMock,
  draftsRepositoryMock,
} from '../../__mocks__/mockServices';

import { DraftsRepository } from '../infrastructure/repositories/drafts-repository';
import { UsersRepository } from '../infrastructure/repositories/users-repository';
import { UsersDetailsViewModel } from './user-details.view-model';
import { QueryClient } from '@tanstack/react-query';

describe('UsersDetailsViewModel Test', () => {
  afterAll(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('should initialize correctly', async () => {
    const userDetailsModel = new UsersDetailsViewModel(
      {
        loadUserQuery: loadUserQueryMock,
        createDraftUser: createDraftUserMock,
        deleteDraftUserCommand: deleteDraftUserCommandMock,
        publishDraftCommand: publishDraftCommandMock,
      }
    );
    userDetailsModel.initialize({ userId: 1 });
    expect(userDetailsModel).toBeTruthy();
    expect(userDetailsModel.publishedUser.value).toEqual(undefined);
    await vi.waitFor(() => expect(userDetailsModel.isLoading.value).toBe(true));
    await vi.waitFor(() => expect(userDetailsModel.isLoading.value).toBe(false));
    
    expect(userDetailsModel.publishedUser.value).toEqual(publishedUserMock);
    expect(userDetailsModel.selectedVersion.value).toEqual('server-1');
    expect(userDetailsModel.userVersions.value?.length).toEqual(2);
    expect(userDetailsModel.drafts.value?.length).toEqual(1);
    expect(userDetailsModel.drafts.value?.[0].data).toEqual(draftUserMock);
  });

  it('can discard draft', async () => {
    const userDetailsModel = new UsersDetailsViewModel(
      {
        loadUserQuery: loadUserQueryMock,
        createDraftUser: createDraftUserMock,
        deleteDraftUserCommand: deleteDraftUserCommandMock,
        publishDraftCommand: publishDraftCommandMock,
      }
    );
    userDetailsModel.initialize({ userId: 1 });
    
    await vi.waitFor(() => expect(userDetailsModel.isLoading.value).toBe(true));
    await vi.waitFor(() => expect(userDetailsModel.isLoading.value).toBe(false));
    
    userDetailsModel.selectedVersion.value = '1';
    expect(userDetailsModel.draft.value?.data).toEqual(expect.objectContaining(draftUserMock));
    await userDetailsModel.discardDraft();
    expect(userDetailsModel.draft.value).toEqual(null);
    expect(userDetailsModel.selectedVersion.value).toEqual('server-1');
  });

  it('can publish draft', async () => {

    // integration test with real repositories and services with mocks
    // test if after creating a draft user the users list is updated
    const queryClient = new QueryClient();
    const draftsRepositoryWithSignals = new DraftsRepository(queryClient, {
      draftsService: draftVersionsServiceMock,
    });

    const usersRepositoryWithSignals = new UsersRepository(queryClient, {
      usersService: usersServiceMock,
    });

    const userFactoryService = new UserVersionFactory();
    const publishDraftCommandWithSignals = new PublishDraftCommand(
      usersRepositoryWithSignals,
      draftsRepositoryWithSignals,
      userFactoryService
    );

    const deleteDraftUserCommandWithSignals = new DeleteDraftUserCommand(
      draftsRepositoryWithSignals
    );

    const userDetailsModel = new UsersDetailsViewModel(
      {
        loadUserQuery: loadUserQueryMock,
        createDraftUser: createDraftUserMock,
        deleteDraftUserCommand: deleteDraftUserCommandWithSignals,
        publishDraftCommand: publishDraftCommandWithSignals,
      }
    );
    userDetailsModel.initialize({ userId: 1 });
    
    await vi.waitFor(() => expect(userDetailsModel.isLoading.value).toBe(true));
    await vi.waitFor(() => expect(userDetailsModel.isLoading.value).toBe(false));
    
    // select the draft
    userDetailsModel.selectedVersion.value = '1';

    // update the name and check if it is updated
    userDetailsModel.updateUser('name', 'Updated Name');
    expect(userDetailsModel.draft.value?.data.name).toEqual('Updated Name');

    // publish the draft. It should delete the draft and insert/update the user in the users repository
    await userDetailsModel.publishDraft();
    expect(userDetailsModel.draft.value).toEqual(null);
    expect(usersRepositoryWithSignals._usersCollection.items.value.length).toEqual(2);
    expect(usersRepositoryWithSignals._usersCollection.items.value[1].name).toEqual('Updated Name');
  });
});
