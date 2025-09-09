import {
  DraftVersionsService,
  FetchHttpClient,
  UsersApiService,
  UserVersionFactory
} from 'contacts-app-core';
import { queryClient } from '../queryClient';
import { UsersRepository } from './infrastructure/repositories/users-repository';

import {
  CreateDraftVersionCommand,
  CreateUserCommand,
  PublishDraftCommand,
  RemoveDraftVersionCommand,
  UpdateDraftVersionCommand,
  UpdateUserCommand,
} from 'contacts-app-core';

import { CreateDraftUserCommand } from './core/commands/create-draft-user.command';
import { FetchUsersQuery } from './core/commands/fetch-users.query';
import { LoadUserQuery } from './core/commands/load-user.query';
import { DraftsRepository } from './infrastructure/repositories/drafts-repository';
import { DeleteDraftUserCommand } from './core/commands/delete-draft-user.command';

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
export const createDraftVersionCommand = new CreateDraftVersionCommand(
  draftVersionsService
);
export const publishDraftCommand = new PublishDraftCommand(
  draftVersionsService,
  usersApiService,
  userFactoryService
);
export const removeDraftCommand = new RemoveDraftVersionCommand(
  draftVersionsService
);
export const updateDraftCommand = new UpdateDraftVersionCommand(
  draftVersionsService
);
export const createUserCommand = new CreateUserCommand(usersApiService);
export const updateUserCommand = new UpdateUserCommand(usersApiService);


export const createDraftUserCommand = new CreateDraftUserCommand(
  userFactoryService,
  draftsRepository,
  usersRepository
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
  draftsRepository,
  usersRepository,
);