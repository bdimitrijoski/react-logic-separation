import { vi } from 'vitest';
import { draftUserMock, draftVersionMock, publishedUserMock } from './mockData';
import {
  IDraftsRepository,
  IUsersRepository,
  DraftVersionsService,
  UserVersionFactory,
  UsersApiService,
  FetchUsersQuery,
  CreateDraftUserCommand,
  DeleteDraftUserCommand,
  LoadUserQuery,
} from 'contacts-app-core';

const usersRepositoryMocks: Partial<IUsersRepository> = {
  getAll: vi.fn().mockResolvedValue([publishedUserMock]),
  fetchById: vi.fn().mockResolvedValue(publishedUserMock),
};

export const usersRepositoryMock = {
  ...usersRepositoryMocks,
} as IUsersRepository;

const draftsRepositoryMocks: Partial<IDraftsRepository> = {
  getAll: vi.fn().mockResolvedValue([draftVersionMock]),
  insert: vi.fn().mockResolvedValue(true),
  getDraftsForUserSync: vi.fn().mockReturnValue([draftVersionMock]),
};

export const draftsRepositoryMock = {
  ...draftsRepositoryMocks,
} as IDraftsRepository;

const userFactoryServiceMockedFunctions: Partial<UserVersionFactory> = {
  createUser: vi.fn().mockReturnValue(draftUserMock),
  createDraftVersion: vi.fn().mockReturnValue(draftVersionMock),
};

export const mockUserFactoryServiceMock = {
  ...userFactoryServiceMockedFunctions,
} as UserVersionFactory;

export const fetchUsersQueryMock = new FetchUsersQuery(
  usersRepositoryMock,
  draftsRepositoryMock
);
export const createDraftUserMock = new CreateDraftUserCommand(
  mockUserFactoryServiceMock,
  draftsRepositoryMock
);
export const deleteDraftUserCommandMock = new DeleteDraftUserCommand(
  draftsRepositoryMock
);
export const loadUserQueryMock = new LoadUserQuery(
  usersRepositoryMock,
  draftsRepositoryMock,
  new UserVersionFactory()
);

export const draftVersionsServiceFunctionsMock: Partial<DraftVersionsService> =
  {
    getAll: vi.fn().mockResolvedValue([draftVersionMock]),
    getAllDraftsSync: vi.fn().mockReturnValue([draftVersionMock]),
  };

export const draftVersionsServiceMock = {
  ...draftVersionsServiceFunctionsMock,
} as DraftVersionsService;

export const usersServiceFunctionsMock: Partial<UsersApiService> = {
  fetchUsers: vi.fn().mockResolvedValue([publishedUserMock]),
};

export const usersServiceMock = {
  ...usersServiceFunctionsMock,
} as UsersApiService;
