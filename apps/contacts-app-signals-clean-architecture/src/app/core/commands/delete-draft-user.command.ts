import { User } from "contacts-app-core";
import { IDraftsRepository } from "../repositories";

interface DeleteDraftUserDTO {
    user: User;
}
export class DeleteDraftUserCommand {
  constructor(
    private draftsRepository: IDraftsRepository
  ) {}
  async execute(dto: DeleteDraftUserDTO) {
    await this.draftsRepository.deleteDraftsForUser(dto.user.id)
  }
}