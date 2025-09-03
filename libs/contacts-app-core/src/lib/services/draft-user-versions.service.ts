import { UserVersion } from '../types';

export class DraftVersionsService {
  getDrafts(userId: number): Promise<UserVersion[]> {
    return new Promise((resolve) => {
      const raw = localStorage.getItem(this.createKey());
      if (!raw) return resolve([]);

      return resolve(JSON.parse(raw) as UserVersion[]);
    });
  }

  getAll(): Promise<UserVersion[]> {
    return Promise.resolve(this.getAllDraftsSync());
  }
  
  getAllDraftsSync(): UserVersion[] {
    const raw = localStorage.getItem(this.createKey());
    if (!raw) return [];

    return JSON.parse(raw) as UserVersion[];
  }

  async saveDraft(userId: number, draft: UserVersion): Promise<UserVersion> {
    const versions = await this.getDrafts(userId);
    const filtered = versions.filter((v) => v.id !== draft.id);
    localStorage.setItem(
      this.createKey(),
      JSON.stringify([draft, ...filtered])
    );
    return draft;
  }

  async deleteDraft(userId: number, versionId: string): Promise<void> {
    const versions = await this.getDrafts(userId);

    const filteredVersions = versions.filter((v) => v.id !== versionId);
    localStorage.setItem(this.createKey(), JSON.stringify(filteredVersions));
  }

  private createKey(): string {
    return `contacts_drafts`;
  }
}
