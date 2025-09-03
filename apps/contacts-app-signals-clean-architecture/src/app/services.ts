import {
  DraftVersionsService,
  FetchHttpClient,
  User,
  UsersApiService,
  UserVersionFactory,
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
import { computed } from '@preact/signals-core';
import { FetchUsersQuery } from './core/commands/fetch-users.query';
import { LoadUserQuery } from './core/commands/load-user.query';

const httpClient = new FetchHttpClient();

export const usersApiService = new UsersApiService(httpClient);
export const draftVersionsService = new DraftVersionsService();
export const userFactoryService = new UserVersionFactory();

export const usersRepository = new UsersRepository(queryClient, {
  usersService: usersApiService,
});

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

export class CreateDraftUserCommand {
  constructor(
    private userFactoryService: UserVersionFactory,
    private usersRepository: UsersRepository
  ) {}
  execute() {
    const userId = Date.now();
    const draftUser = userFactoryService.createUser(Date.now(), {
      name: `New User ${userId}`,
      email: '',
      phone: '',
    });
    const user = this.userFactoryService.createUser(userId, draftUser);
    this.usersRepository.createUser(user);
  }
}

export const createDraftUserCommand = new CreateDraftUserCommand(
  userFactoryService,
  usersRepository
);

export const fetchUsersQuery = new FetchUsersQuery(
  usersRepository,
  draftVersionsService
);

export const loadUserQuery = new LoadUserQuery(
  usersRepository,
  draftVersionsService,
  userFactoryService
);