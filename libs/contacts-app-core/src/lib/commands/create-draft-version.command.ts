import { DraftVersionsService } from "../services/draft-user-versions.service";
import { UserVersion } from "../types";

interface CreateDraftVersionDTO {
    // userId: number;
    // user: User;
    userVersion: UserVersion;
}
export class CreateDraftVersionCommand {
  constructor(private versionsService: DraftVersionsService) {}

  async execute(dto: CreateDraftVersionDTO): Promise<UserVersion> {
  //   const version: UserVersion = {
  //     id: String(Date.now()),
  //     data: {  ...dto.user, id: dto.userId },
  //     timestamp: Date.now(),
  //     isDraft: true,
  // };
  this.versionsService.saveDraft(dto.userVersion.data.id, dto.userVersion);
  return dto.userVersion;
  }
}