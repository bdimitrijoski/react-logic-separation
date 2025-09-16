import { IDraftsRepository, IUsersRepository } from '../boundaries/repositories';
import { UserVersionFactory } from '../services/user-version-factory.service';
import { UserVersion } from '../types';

interface PublishDraftDTO {
  version: UserVersion;
  isNew: boolean;
}
export class PublishDraftCommand {
  constructor(
    private usersRepository: IUsersRepository,
    private draftsRepository: IDraftsRepository,
    private userFactoryService: UserVersionFactory
  ) {}

  async execute(dto: PublishDraftDTO): Promise<UserVersion> {
    const saved = dto.version.isDraft
      ? await this.usersRepository.insert(dto.version.data)
      : await this.usersRepository.update(dto.version.data);
    // once published, remove draft
    this.draftsRepository.deleteDraftsForUser(dto.version.data.id);
    return this.userFactoryService.createVersion(saved);
  }
}
