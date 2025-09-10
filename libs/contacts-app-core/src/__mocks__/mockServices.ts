import { vi } from 'vitest';
import { IDraftsRepository, IUsersRepository } from '../lib/boundaries/repositories';
import { draftUserMock, draftVersionMock, publishedUserMock } from './mockData';
import { UsersApiService } from '../lib/services/users-api.service';
import { DraftVersionsService } from '../lib/services/draft-user-versions.service';
import { UserVersionFactory } from '../lib/services/user-version-factory.service';


// Services mocks
export const draftVersionsServiceFunctionsMock: Partial<DraftVersionsService> = {
  getAll: vi.fn().mockResolvedValue([draftVersionMock]),
  getAllDraftsSync: vi.fn().mockReturnValue([draftVersionMock]),
};

export const draftVersionsServiceMock = {
  ...draftVersionsServiceFunctionsMock,
} as DraftVersionsService;



// users api service mock

export const usersServiceFunctionsMock: Partial<UsersApiService> = {
  fetchUsers: vi.fn().mockResolvedValue([publishedUserMock]),
};

export const usersServiceMock = {
  ...usersServiceFunctionsMock,
} as UsersApiService;


// user factory service mock
const userFactoryServiceMockedFunctions: Partial<UserVersionFactory> = {
  createUser: vi.fn().mockReturnValue(draftUserMock),
  createDraftVersion: vi.fn().mockReturnValue(draftVersionMock),
};

export const mockUserFactoryServiceMock = {
  ...userFactoryServiceMockedFunctions,
} as UserVersionFactory;


// repositories mocks
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





