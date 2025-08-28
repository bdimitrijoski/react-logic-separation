import { DraftVersionsService } from "../services/draft-user-versions.service";
import { User, UserVersion } from "../types";

interface LoadUserVersionsDTO {
    user: User;
}

export class LoadUserVersionsCommand {
  constructor(private versionsService: DraftVersionsService) {}

  async execute(dto: LoadUserVersionsDTO): Promise<UserVersion[]> {
    const drafts = await this.versionsService.getDrafts(dto.user.id);
    return [
      {
        id: `server-${dto.user.id}`,
        data: dto.user,
        timestamp: Date.now(),
        isDraft: false,
      },
      ...drafts,
    ];
  }
}
