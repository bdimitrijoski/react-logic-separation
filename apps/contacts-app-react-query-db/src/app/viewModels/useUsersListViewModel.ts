import { useLiveQuery } from '@tanstack/react-db';
import { eq, ilike, lt, like } from '@tanstack/db';
import { useState } from 'react';
import { usersCollection } from '../collections/usersCollection';
import { draftsCollection } from '../collections/draftsCollection';
import { User } from 'contacts-app-core';
import { userFactoryService } from '../services';
import { useNavigate } from 'react-router-dom';

export function useUsersListViewModel() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // 1. Live server users
  const { data: serverUsers = [] } = useLiveQuery(
    (q) =>
      q
        .from({ user: usersCollection })
        .where(({ user }) => ilike(user.name, `%${search}%`)) // Only live users, not drafts
        .select(({ user }) => ({ ...user, id: user.id, name: user.name })),
    [search]
  );

  // 2. Live drafts that represent *new* users (id < 0)
  const { data: newDrafts = [] } = useLiveQuery(q =>
    q
      .from({ draft: draftsCollection })
      .where(({draft}) => eq(draft.isDraft, true))
      // .where(({draft}) => lt(+draft.id, 0))
      .select(({ draft }) => ({...draft}))
  )

  console.log('New drafts', newDrafts);

  // 3. Merge new drafts at top, then live users
  const combinedList: User[] = [
    ...newDrafts.map((d) => d.data),
    ...serverUsers,
  ];

  // Called when user hits "Create new User":
  const createNewDraftUser = async () => {
    const userId = Date.now();
    const draftUser = userFactoryService.createUser(Date.now(), { name: `New User ${userId}`, email: '', phone: '' });
    const draftVersion = userFactoryService.createDraftVersion(draftUser);
    await draftsCollection.insert(draftVersion);
    navigate(`/users/${draftVersion.data.id}`);
  };

  return { users: combinedList, search, setSearch, createNewDraftUser };
}
