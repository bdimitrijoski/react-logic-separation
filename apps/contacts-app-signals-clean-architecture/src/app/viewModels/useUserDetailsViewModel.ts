import { useCallback, useEffect } from 'react';
import { useSignalValue } from '../lib/use-signal-value';
import { userDetailsModel } from './user-details.view-model';

export function useUserDetailsViewModel(userId: number) {

  // Re-initialize the view model when userId changes
  // not always needed if the view model does not need to dispose/re-init
  useEffect(() => {
    userDetailsModel.dispose();
    userDetailsModel.initialize({ userId });
  }, [userId]);

  const publishedUser = useSignalValue(userDetailsModel.publishedUser);
  const draft = useSignalValue(userDetailsModel.draft);
  const selectedVersion = useSignalValue(userDetailsModel.selectedVersion);

  const setSelectedId = useCallback((id: string) => {
    userDetailsModel.selectedVersion.value = id;
  }, []);

  return {
    versions: useSignalValue(userDetailsModel.userVersions) || [],
    selectedId: selectedVersion,
    setSelectedId,
    isLoading: useSignalValue(userDetailsModel.isLoading),
    isError: useSignalValue(userDetailsModel.isError),
    current: selectedVersion && draft?.data ? draft?.data : publishedUser,
    startEdit: userDetailsModel.startEdit.bind(userDetailsModel),
    onChangeField: userDetailsModel.updateUser.bind(userDetailsModel),
    onPublish: userDetailsModel.publishDraft.bind(userDetailsModel),
    onDiscard: userDetailsModel.discardDraft.bind(userDetailsModel),
  };
}
