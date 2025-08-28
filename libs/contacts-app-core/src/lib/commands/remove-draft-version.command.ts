import { DraftVersionsService } from "../services/draft-user-versions.service";

interface RemoveDraftVersionDTO {
    userId: number;
    versionId: string;
}
export class RemoveDraftVersionCommand {
  constructor(private versionsService: DraftVersionsService) {}

  execute(dto: RemoveDraftVersionDTO): void {
    this.versionsService.deleteDraft(dto.userId, dto.versionId);
  }
}