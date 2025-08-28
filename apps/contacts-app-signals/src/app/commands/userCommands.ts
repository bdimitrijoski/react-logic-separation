import { CreateDraftVersionCommand, CreateUserCommand, PublishDraftCommand, RemoveDraftVersionCommand, UpdateDraftVersionCommand, UpdateUserCommand } from "contacts-app-core";
import { draftVersionsService, userFactoryService, usersApiService } from "../services";

export const createDraftVersionCommand = new CreateDraftVersionCommand(draftVersionsService);
export const publishDraftCommand = new PublishDraftCommand(draftVersionsService, usersApiService, userFactoryService);
export const removeDraftCommand = new RemoveDraftVersionCommand(draftVersionsService);
export const updateDraftCommand = new UpdateDraftVersionCommand(draftVersionsService);
export const createUserCommand = new CreateUserCommand(usersApiService);
export const updateUserCommand = new UpdateUserCommand(usersApiService);