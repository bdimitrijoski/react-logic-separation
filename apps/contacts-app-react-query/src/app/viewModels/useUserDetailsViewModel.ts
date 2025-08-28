import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    createDraftVersion,
    loadUser,
    loadUserVersions,
    publishDraft,
    removeDraft,
    removeUser,
    updateDraftVersion,
} from '../commands/userCommands';
import { User, Version } from '../types';

const usersQueryKey = ['users'] as const;
export function useUserDetailsViewModel(userId: number) {
  const qc = useQueryClient();
//   const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [draft, setDraft] = useState<Version<User> | null>(null);

  const setSelectedVersion = (versionId: string) => '';

  console.log('useUserDetailsViewModel for userId:', ['user', userId]);
  const {
    data: serverUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => loadUser(userId),

    // queryOptions: {

    //   onSuccess: (u) => {
    //     const versions = loadUserVersions(u);
    //     const draftVer = versions.find((v) => v.isDraft) || null;
    //     setDraft(draftVer);
    //     setSelectedVersion(draftVer?.id ?? `server-${u.id}`);
    //   },
    // },
  });

  const selectedVersion = useMemo(() => {
    if (!serverUser || !userId) return '';
    const versions = loadUserVersions(serverUser);
    const draftVer = versions.find((v) => v.isDraft) || null;
    setDraft(draftVer);
    return draftVer?.id ?? `server-${serverUser.id}`;
  }, [serverUser, userId]);

  const versions = serverUser ? loadUserVersions(serverUser) : [];

  // auto-save draft on change
  // useEffect(() => {
  //   if (draft && draft.isDraft) {
  //     updateDraftVersion(userId, draft);
  //   }
  // }, [draft, userId]);

  const startEdit = () => {
    if (!serverUser) return;
    const newDraft = createDraftVersion(serverUser);
    setDraft(newDraft);
    setSelectedVersion(newDraft.id);
  };

  const onChangeField = useCallback(
    (field: keyof User, value: string) => {
      if (!draft) return;
      setDraft({ ...draft, data: { ...draft.data, [field]: value } });
    },
    [draft]
  );

  const onPublish = async () => {
    if (!draft) return;
    const isNew = serverUser === undefined;
    const saved = await publishDraft(draft, isNew);
    qc.invalidateQueries({ queryKey: usersQueryKey });
    qc.setQueryData(['user', saved.id], saved);
  };

  const onDeleteDraft = async () => {
    if (!draft) return;
    await removeDraft(userId, draft.id);
    setDraft(null);
    setSelectedVersion(`server-${userId}`);
  };

  const onDeleteUser = async () => {
    await removeUser(userId);
    qc.invalidateQueries({ queryKey: usersQueryKey });
  };

  const currentData =
    selectedVersion === `server-${userId}` ? serverUser : draft?.data;

  console.log('userId', userId);
  console.log('serverUser', serverUser);
  console.log('User versions', versions);
  console.log('Selected version', selectedVersion);
  console.log('Current data', currentData);

  return {
    versions,
    selectedVersion,
    setSelectedVersion,
    currentData,
    isLoading,
    isError,
    startEdit,
    onChangeField,
    onPublish,
    onDeleteDraft,
    onDeleteUser,
  };
}
