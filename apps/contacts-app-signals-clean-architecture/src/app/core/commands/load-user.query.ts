import { UserVersionFactory } from "contacts-app-core";
import { IDraftsRepository, IUsersRepository } from "../repositories";

export class LoadUserQuery {
  constructor(
    private usersRepository: IUsersRepository,
    private draftsRepository: IDraftsRepository,
    private userFactoryService: UserVersionFactory
  ) {}

  async execute(userId: number) {
    const publishedUser = await this.usersRepository.fetchById(userId);

    const userDrafts = await this.draftsRepository.getDraftsForUser(userId);

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