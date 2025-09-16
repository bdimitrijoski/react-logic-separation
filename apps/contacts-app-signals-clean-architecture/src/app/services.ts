import {
  DraftVersionsService,
  FetchHttpClient,
  UsersApiService,
  UserVersionFactory,
  PublishDraftCommand,
  CreateDraftUserCommand,
  FetchUsersQuery,
  LoadUserQuery,
  DeleteDraftUserCommand,
} from 'contacts-app-core';
import { queryClient } from '../queryClient';

import { DraftsRepository } from './infrastructure/repositories/drafts-repository';
import { UsersRepository } from './infrastructure/repositories/users-repository';

// Initialize the core services
const httpClient = new FetchHttpClient();

// Initialize the Domain/API services
export const usersApiService = new UsersApiService(httpClient);
export const draftVersionsService = new DraftVersionsService();
export const userFactoryService = new UserVersionFactory();

// Initialize the repository implementations
export const usersRepository = new UsersRepository(queryClient, {
  usersService: usersApiService,
});

export const draftsRepository = new DraftsRepository(queryClient, {
  draftsService: draftVersionsService,
});

// Finally initialize commands and queries
export const publishDraftCommand = new PublishDraftCommand(
  usersRepository,
  draftsRepository,
  userFactoryService
);

export const createDraftUserCommand = new CreateDraftUserCommand(
  userFactoryService,
  draftsRepository
);

export const fetchUsersQuery = new FetchUsersQuery(
  usersRepository,
  draftsRepository
);

export const loadUserQuery = new LoadUserQuery(
  usersRepository,
  draftsRepository,
  userFactoryService
);
export const deleteDraftUserCommand = new DeleteDraftUserCommand(
  draftsRepository
);
