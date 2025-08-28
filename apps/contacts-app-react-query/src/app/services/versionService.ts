import { Version, User } from '../types';

function key(userId: number): string {
  return `contacts_versions_${userId}`;
}

export function getVersions(userId: number): Version<User>[] {
  const raw = localStorage.getItem(key(userId));
  if (!raw) return [];
  return JSON.parse(raw) as Version<User>[];
}

export function saveVersion(userId: number, version: Version<User>): void {
  const versions = getVersions(userId);
  const filtered = versions.filter(v => v.id !== version.id);
  localStorage.setItem(key(userId), JSON.stringify([version, ...filtered]));
}

export function deleteVersion(userId: number, versionId: string): void {
  const versions = getVersions(userId).filter(v => v.id !== versionId);
  localStorage.setItem(key(userId), JSON.stringify(versions));
}
