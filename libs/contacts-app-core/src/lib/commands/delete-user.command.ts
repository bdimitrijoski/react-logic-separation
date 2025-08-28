import { DraftVersionsService } from "../services/draft-user-versions.service";
import { UsersApiService } from "../services/users-api.service";

interface DeleteUserDTO {
    userId: number;
}
export class DeleteUserCommand {
    constructor(private usersApiService: UsersApiService, private draftsService: DraftVersionsService) {}

  async execute(dto: DeleteUserDTO): Promise<void> {
    const draftVersions = await this.draftsService.getDrafts(dto.userId);
    await this.usersApiService.deleteUser(dto.userId);

    draftVersions.forEach(v => this.draftsService.deleteDraft(dto.userId, v.id));
  }
}