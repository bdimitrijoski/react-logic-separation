import { User, UserVersion } from '../types';

export class UserVersionFactory {
  getPublishedVersionId(userId: number): string {
    return `server-${userId}`;
  }

  createVersion(user: User): UserVersion {
    return {
      id: this.getPublishedVersionId(user.id),
      data: user,
      timestamp: Date.now(),
      isDraft: false,
    };
  }

  createDraftVersion(base: User): UserVersion {
    const version: UserVersion = {
      id: String(Date.now()),
      data: { ...base },
      timestamp: Date.now(),
      isDraft: true,
    };
    return version;
  }

  createUser(id?: number, userData?: Partial<User>): User {
    return {
      id: id ?? Date.now(),
      name: userData?.name ?? '',
      username: userData?.username ?? '',
      website: userData?.website ?? '',
      email: userData?.email ?? '',
      phone: userData?.phone ?? '',
    };
  }
}
