import {
  IDraftsRepository,
  IUsersRepository,
} from '../boundaries/repositories';
import { UserVersionFactory } from '../services/user-version-factory.service';

export class LoadUserQuery {
  constructor(
    private usersRepository: IUsersRepository,
    private draftsRepository: IDraftsRepository,
    private userFactoryService: UserVersionFactory
  ) {}

  async execute(userId: number) {
    const userDrafts = this.draftsRepository.getDraftsForUserSync(userId);
    const publishedUser = await this.usersRepository.fetchById(userId);

    const userVersions = [
      ...(publishedUser
        ? [this.userFactoryService.createVersion(publishedUser)]
        : []),
      ...(userDrafts || []),
    ];

    return {
      publishedUser,
      userVersions,
    };
  }
}
