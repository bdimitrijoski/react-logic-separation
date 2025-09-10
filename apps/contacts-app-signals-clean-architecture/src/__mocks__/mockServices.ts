import { vi } from 'vitest';
import { IDraftsRepository, IUsersRepository } from '../app/core/repositories';
import { draftUserMock, draftVersionMock, publishedUserMock } from './mockData';
import { DraftVersionsService, UserVersionFactory, UsersApiService } from 'contacts-app-core';
import { FetchUsersQuery } from '../app/core/commands/fetch-users.query';
import { CreateDraftUserCommand } from '../app/core/commands/create-draft-user.command';
import { DeleteDraftUserCommand } from '../app/core/commands/delete-draft-user.command';

const usersRepositoryMocks: Partial<IUsersRepository> = {
  getAll: vi.fn().mockResolvedValue([publishedUserMock]),
};

export const usersRepositoryMock = {
  ...usersRepositoryMocks,
} as IUsersRepository;

const draftsRepositoryMocks: Partial<IDraftsRepository> = {
  getAll: vi.fn().mockResolvedValue([draftVersionMock]),
  insert: vi.fn().mockResolvedValue(true),
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

export const draftVersionsServiceFunctionsMock: Partial<DraftVersionsService> = {
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
