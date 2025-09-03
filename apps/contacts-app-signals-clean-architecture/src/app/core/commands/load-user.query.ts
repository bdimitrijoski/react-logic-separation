import { DraftVersionsService, UserVersionFactory } from "contacts-app-core";
import { IUsersRepository } from "../repositories";

export class LoadUserQuery {
  constructor(
    private usersRepository: IUsersRepository,
    private draftsService: DraftVersionsService,
    private userFactoryService: UserVersionFactory
  ) {}

  async execute(userId: number) {
    console.log('LoadUserQuery execute called', userId);
    const publishedUser = await this.usersRepository.fetchById(userId);

    const userDrafts = await this.draftsService.getDrafts(userId);

    const userVersions = [
          ...(publishedUser ? [this.userFactoryService.createVersion(publishedUser)] : []),
          ...(userDrafts || []),
        ];

    return {
        publishedUser,
        userVersions
    }
  }
}