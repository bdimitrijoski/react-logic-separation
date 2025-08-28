import * as usersApiService from '../services/users-api.service';
import * as versionsService from '../services/versionService';
import { User, Version } from '../types';

export async function loadUsersPage(
  page: number,
  limit: number,
  search?: string,
  sortKey?: keyof User
) {
  return usersApiService.fetchUsersPage(page, limit, search, sortKey);
}

export async function loadUser(id: number): Promise<User> {
    const user = await usersApiService.fetchUser(id);
    console.log('Loaded user:', user);
  return user;
}

export function loadUserVersions(user: User): Version<User>[] {
  const drafts = versionsService.getVersions(user.id);
  return [
    {
      id: `server-${user.id}`,
      data: user,
      timestamp: Date.now(),
      isDraft: false,
    },
    ...drafts,
  ];
}

export function createDraftVersion(base: User): Version<User> {
  const version: Version<User> = {
    id: String(Date.now()),
    data: { ...base },
    timestamp: Date.now(),
    isDraft: true,
  };
  versionsService.saveVersion(base.id, version);
  return version;
}

export function updateDraftVersion(
  userId: number,
  version: Version<User>
): void {
  versionsService.saveVersion(userId, version);
}

export async function publishDraft(
  version: Version<User>,
  isNew: boolean
): Promise<User> {
  const saved = isNew
    ? await usersApiService.createUser(version.data)
    : await usersApiService.updateUser(version.data);
  // once published, remove draft
  versionsService.deleteVersion(saved.id, version.id);
  return saved;
}

export async function removeDraft(
  userId: number,
  versionId: string
): Promise<void> {
  versionsService.deleteVersion(userId, versionId);
}

export async function removeUser(userId: number): Promise<void> {
  await usersApiService.deleteUser(userId);
  // clear all drafts
  versionsService.getVersions(userId).forEach(v => versionsService.deleteVersion(userId, v.id));
}
