import { DraftVersionsService, FetchHttpClient, UsersApiService, UserVersionFactory } from "contacts-app-core";

const httpClient = new FetchHttpClient();

export const usersApiService = new UsersApiService(httpClient);
export const draftVersionsService = new DraftVersionsService();
export const userFactoryService = new UserVersionFactory();