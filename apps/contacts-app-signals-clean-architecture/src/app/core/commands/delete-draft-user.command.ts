import { User, UserVersionFactory } from "contacts-app-core";
import { IDraftsRepository, IUsersRepository } from "../repositories";

interface DeleteDraftUserDTO {
    user: User;
}
export class DeleteDraftUserCommand {
  constructor(
    private draftsRepository: IDraftsRepository,
    private usersRepository: IUsersRepository
  ) {}
  async execute(dto: DeleteDraftUserDTO) {
    // await this.usersRepository.delete(dto.user.id);
    await this.draftsRepository.deleteDraftsForUser(dto.user.id)
  }
}