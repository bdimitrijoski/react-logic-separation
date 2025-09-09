import { User, UserVersion } from 'contacts-app-core';
import { useCallback, useMemo } from 'react';
import { useSignalValue } from '../lib/use-signal-value';
import { createDraftUserCommand, deleteDraftUserCommand, loadUserQuery, userFactoryService } from '../services';
import { UsersDetailsViewModel } from './user-details.view-model';
import { useViewModel } from '../hooks/useViewModel';

export function useUserDetailsViewModel(userId: number) {

  const createCallback = useCallback(() => new UsersDetailsViewModel({
    loadUserQuery,
    createDraftUser: createDraftUserCommand,
    deleteDraftUserCommand
  }, userId), [userId]);
  const model = useViewModel(createCallback)
  // const model = useMemo(() => new UsersDetailsViewModel({
  //   loadUserQuery,
  //   createDraftUser: createDraftUserCommand,
  //   deleteDraftUserCommand
  // }, userId), [userId]);

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

  // const onChangeField = useCallback(
  //   (field: keyof User, value: string) => {
  //     if (!draft) return;
  //     setDraft({
  //       ...draft,
  //       data: { ...draft.data, [field]: value },
  //       timestamp: Date.now(),
  //     });
  //   },
  //   [draft, setDraft]
  // );

  // Discard local draft
  // const onDiscard = async () => {
  //   if (!draft) return;
  //   // draftsCollection.delete(draft.id);
  //   setDraft(null);
  //   setSelectedId(publishedUserVersionId);
  // };

  // Publish draft to server
  const onPublish = useCallback(async () => {
    if (!draft) return;
    console.log('Publishing', draft);
    // await onDiscard();
  }, []);

  console.log('selectedVersion', selectedVersion)
  return {
    versions: useSignalValue(model.userVersions),
    selectedId: selectedVersion,
    setSelectedId,
    isLoading: false, // useSignalValue(model.isLoading),
    isError: false, // useSignalValue(model.isError),
    current:
      selectedVersion && draft?.data
        ? draft?.data
        : publishedUser,
    startEdit: model.startEdit.bind(model),
    onChangeField: model.updateUser.bind(model),
    onPublish,
    onDiscard: model.discardDraft.bind(model),
  };
}
