import {
  UserVersionFactory,
  CreateDraftUserCommand,
  FetchUsersQuery,
  DeleteDraftUserCommand,
} from 'contacts-app-core';
import { draftUserMock, publishedUserMock } from '../../__mocks__/mockData';
import {
  createDraftUserMock,
  deleteDraftUserCommandMock,
  draftVersionsServiceMock,
  fetchUsersQueryMock,
  loadUserQueryMock,
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
      },
      1
    );
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
});
