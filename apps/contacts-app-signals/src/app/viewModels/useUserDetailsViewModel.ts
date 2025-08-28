import { User, UserVersion } from 'contacts-app-core';
import { useCallback, useMemo } from 'react';
import { queryClient } from '../../queryClient';
import { useSignalValue } from '../lib/use-signal-value';
import { draftVersionsService, userFactoryService, usersApiService } from '../services';
import { UsersDetailsViewModel } from './user-details.view-model';

export function useUserDetailsViewModel(userId: number) {

  const model = useMemo(() => new UsersDetailsViewModel(queryClient, {
    usersService: usersApiService,
    draftsService: draftVersionsService,
    userFactoryService
  }, userId), [userId]);

  const publishedUser = useSignalValue(model.publishedUser);
  const draft = useSignalValue(model.draft);
  const selectedVersion = useSignalValue(model.selectedVersion);

  const publishedUserVersionId = useMemo(
    () => userFactoryService.getPublishedVersionId(userId),
    [userId]
  );
  
  const setSelectedId = useCallback((id: string) => {
    model.selectedVersion.value = id;
  }, [model]);

  const setDraft = useCallback((d: UserVersion | null) => {
    model.draft.value = d;
  }, [model]);

  // When user hits “Edit”:
  const startEdit = async () => {
    if (!publishedUser) return;
    const newVersion = userFactoryService.createDraftVersion(publishedUser);
    // await draftsCollection.insert(newVersion);
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
    [draft, setDraft]
  );

  // Discard local draft
  const onDiscard = async () => {
    if (!draft) return;
    // draftsCollection.delete(draft.id);
    setDraft(null);
    setSelectedId(publishedUserVersionId);
  };

  // Publish draft to server
  const onPublish = async () => {
    if (!draft) return;
    console.log('Publishing', draft);
    await onDiscard();
  };

  return {
    versions: useSignalValue(model.userVersions),
    selectedId: selectedVersion,
    setSelectedId,
    isLoading: useSignalValue(model.isLoading),
    isError: useSignalValue(model.isError),
    current:
      selectedVersion && !selectedVersion.startsWith(publishedUserVersionId)
        ? draft?.data
        : publishedUser,
    startEdit,
    onChangeField,
    onPublish,
    onDiscard,
  };
}
