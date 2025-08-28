import { DraftVersionsService } from "../services/draft-user-versions.service";
import { UserVersion } from "../types";

interface UpdateDraftVersionDTO {
    userId: number;
    version: UserVersion;
}
export class UpdateDraftVersionCommand {
  constructor(private versionsService: DraftVersionsService) {}

  execute(dto: UpdateDraftVersionDTO): void {
    this.versionsService.saveDraft(dto.userId, dto.version);
  }
}