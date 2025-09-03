import { UserVersionFactory } from "contacts-app-core";
import { IDraftsRepository, IUsersRepository } from "../repositories";

export class CreateDraftUserCommand {
  constructor(
    private userFactoryService: UserVersionFactory,
    private draftsRepository: IDraftsRepository
  ) {}
  execute() {
    const userId = Date.now();
    const draftUser = this.userFactoryService.createUser(Date.now(), {
      name: `New User ${userId}`,
      email: '',
      phone: '',
    });
    const user = this.userFactoryService.createUser(userId, draftUser);
    const version = this.userFactoryService.createDraftVersion(user);
    this.draftsRepository.insert(version);
  }
}