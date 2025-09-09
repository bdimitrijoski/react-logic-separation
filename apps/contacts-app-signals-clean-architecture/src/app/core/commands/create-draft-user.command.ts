import { User, UserVersionFactory } from 'contacts-app-core';
import { IDraftsRepository, IUsersRepository } from '../repositories';

interface CreateDraftUserDTO {
  user?: User;
}
export class CreateDraftUserCommand {
  constructor(
    private userFactoryService: UserVersionFactory,
    private draftsRepository: IDraftsRepository,
    private usersRepository: IUsersRepository
  ) {}
  async execute(dto?: CreateDraftUserDTO) {
    const userId = dto?.user?.id ?? Date.now();
    let user = dto?.user;

    if (dto?.user) {
      user = {
        ...dto.user,
      };
    } else {
      const draftUser = this.userFactoryService.createUser(Date.now(), {
        name: `New User ${userId}`,
        email: '',
        phone: '',
      });
      user = this.userFactoryService.createUser(userId, draftUser);
    }

    const version = this.userFactoryService.createDraftVersion(user);
    console.log('Creating new user', version);
    const createdVersion = await this.draftsRepository.insert(version);
    // await this.usersRepository.insert(user);
    return version;
  }
}
