import { User, UserVersionFactory } from 'contacts-app-core';
import { IDraftsRepository } from '../repositories';

interface CreateDraftUserDTO {
  user?: User;
}
export class CreateDraftUserCommand {
  constructor(
    private userFactoryService: UserVersionFactory,
    private draftsRepository: IDraftsRepository,
  ) {}
  async execute(dto?: CreateDraftUserDTO) {
    let user = dto?.user;

    // If no user is provided, create a new one with a unique ID
    if (!user) {
      const userId = Date.now();
      user = this.userFactoryService.createUser(userId, {
        name: `New User ${userId}`,
        email: '',
        phone: '',
      });
    }

    const version = this.userFactoryService.createDraftVersion(user);
    await this.draftsRepository.insert(version);

    return version;
  }
}
