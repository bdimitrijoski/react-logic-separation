import { User, Page } from '../types';

const BASE = 'https://jsonplaceholder.typicode.com';

export async function fetchUsersPage(
  page: number,
  limit: number,
  search?: string,
  sortKey?: keyof User
): Promise<Page<User>> {
  const params = new URLSearchParams();
  params.set('_page', String(page));
  params.set('_limit', String(limit));
  if (search) params.set('name_like', search);
  if (sortKey) {
    params.set('_sort', sortKey);
    params.set('_order', 'asc');
  }

  const resp = await fetch(`${BASE}/users?${params.toString()}`);
  if (!resp.ok) throw new Error('Failed to fetch users');
  const total = Number(resp.headers.get('x-total-count') || limit);
  const items = (await resp.json()) as User[];
  const maxPage = Math.ceil(total / limit);

  return {
    items,
    nextPage: page < maxPage ? page + 1 : undefined,
  };
}

export async function fetchUser(id: number): Promise<User> {
  const resp = await fetch(`${BASE}/users/${id}`);
  if (!resp.ok) throw new Error('Failed to fetch user');
  return resp.json();
}

export async function createUser(data: Omit<User, 'id'>): Promise<User> {
  const resp = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!resp.ok) throw new Error('Failed to create user');
  return resp.json();
}

export async function updateUser(user: User): Promise<User> {
  const resp = await fetch(`${BASE}/users/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!resp.ok) throw new Error('Failed to update user');
  return resp.json();
}

export async function deleteUser(id: number): Promise<void> {
  await fetch(`${BASE}/users/${id}`, { method: 'DELETE' });
}
