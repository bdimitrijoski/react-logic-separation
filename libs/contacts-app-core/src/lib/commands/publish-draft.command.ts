import { DraftVersionsService } from '../services/draft-user-versions.service';
import { UserVersionFactory } from '../services/user-version-factory.service';
import { UsersApiService } from '../services/users-api.service';
import { UserVersion } from '../types';

interface PublishDraftDTO {
  version: UserVersion;
  isNew: boolean;
}
export class PublishDraftCommand {
  constructor(
    private versionsService: DraftVersionsService,
    private usersService: UsersApiService,
    private userFactoryService: UserVersionFactory
  ) {}

  async execute(dto: PublishDraftDTO): Promise<UserVersion> {
    const saved = dto.isNew
      ? await this.usersService.createUser(dto.version.data)
      : await this.usersService.updateUser(dto.version.data);
    // once published, remove draft
    this.versionsService.deleteDraft(saved.id, dto.version.id);
    return this.userFactoryService.createVersion(saved);
  }
}
