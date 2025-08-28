import { User, UserVersion } from 'contacts-app-core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { draftsCollection } from '../collections/draftsCollection';
import { usersCollection } from '../collections/usersCollection';
import { usePublishedUser } from '../hooks/usePublishedUser';
import { useUserDrafts } from '../hooks/useUserDrafts';
import { userFactoryService } from '../services';

export function useUserDetailsViewModel(userId: number) {
  // 1. Live fetch server user
  const {
    user: serverUser,
    isLoading: isServerUserLoading,
    isError: isServerUserError,
  } = usePublishedUser(userId);

  const publishedUserVersionId = useMemo(
    () => userFactoryService.getPublishedVersionId(userId),
    [userId]
  );

  // 2. Live fetch all drafts for this user
  // unfortunately, there is no union query in @tanstack/db yet
  const {
    drafts,
    isError: errorLoadingDrafts,
    isLoading: loadingDrafts,
  } = useUserDrafts(userId);

  // 3. Build version list: server version + local drafts
  const versions: UserVersion[] = useMemo(
    () => [
      ...(serverUser ? [userFactoryService.createVersion(serverUser)] : []),
      ...drafts,
    ],
    [serverUser, drafts]
  );

  

  // 4. UI state: which version is selected
  const [selectedId, setSelectedId] = useState<string>(versions[0]?.id ?? '');

  // 5. Editable draft state
  const [draft, setDraft] = useState<UserVersion | null>(
    () => drafts.find((d) => d.id === selectedId) || null
  );

  // Auto‐save on local draft change
  // This should be debounced/throttled in real application
  useEffect(() => {
    if (!draft) return;
    draftsCollection.update(draft.id, (d) => {
      d.data = draft.data;
    });
  }, [draft]);

  // When user hits “Edit”:
  const startEdit = async () => {
    if (!serverUser) return;
    const newVersion = userFactoryService.createDraftVersion(serverUser);
    await draftsCollection.insert(newVersion);
    setSelectedId(newVersion.id);
    setDraft(newVersion);
  };

  const onChangeField = useCallback(
    (field: keyof User, value: string) => {
      if (!draft) return;
      setDraft({
        ...draft,
        data: { ...draft.data, [field]: value },
        timestamp: Date.now(),
      });
    },
    [draft]
  );

  // Discard local draft
  const onDiscard = async () => {
    if (!draft) return;
    draftsCollection.delete(draft.id);
    setDraft(null);
    setSelectedId(publishedUserVersionId);
  };

  // Publish draft to server
  const onPublish = async () => {
    if (!draft) return;
    if (draft.data.id) {
      const request = usersCollection.update(
        draft.data.id,
        (draftItem) => {
          // Copy all properties from your local draft to the draftItem
          Object.assign(draftItem, draft.data);
        }
      );

      await request.isPersisted.promise;
    } else {
      usersCollection.insert(draft.data);
    }
    await onDiscard();
  };

  return {
    versions,
    selectedId,
    setSelectedId,
    isLoading: isServerUserLoading || loadingDrafts,
    isError: isServerUserError || errorLoadingDrafts,
    current:
      selectedId && !selectedId.startsWith(publishedUserVersionId)
        ? draft?.data
        : serverUser,
    startEdit,
    onChangeField,
    onPublish,
    onDiscard,
  };
}
