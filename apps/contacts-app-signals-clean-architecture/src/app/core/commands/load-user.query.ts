import { UserVersionFactory } from "contacts-app-core";
import { IDraftsRepository, IUsersRepository } from "../repositories";

export class LoadUserQuery {
  constructor(
    private usersRepository: IUsersRepository,
    private draftsRepository: IDraftsRepository,
    private userFactoryService: UserVersionFactory
  ) {}

  async execute(userId: number) {
    console.log('LoadUserQuery called');
    const userDrafts = this.draftsRepository.getDraftsForUserSync(userId);
    const publishedUser = await this.usersRepository.fetchById(userId);


    const userVersions = [
          ...(publishedUser ? [this.userFactoryService.createVersion(publishedUser)] : []),
          ...(userDrafts || []),
        ];

        console.log('LoadUserQuery called', userVersions)
    return {
        publishedUser,
        userVersions
    }
  }
}