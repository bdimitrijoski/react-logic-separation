import { createCollection, localOnlyCollectionOptions } from '@tanstack/react-db'
import { UserVersion } from 'contacts-app-core'
import { draftVersionsService } from '../services'
import { createDraftVersionCommand, removeDraftCommand, updateDraftCommand } from '../commands/userCommands'

// Each draft.version.data.id === original User.id
export const draftsCollection = createCollection(
  localOnlyCollectionOptions<UserVersion>({
    id: 'user-drafts',
    getKey: version => version.id,
    initialData: draftVersionsService.getAllDraftsSync(), // start empty
    onInsert: async ({ transaction }) => {
      const newDraft = transaction.mutations[0].modified;
      await createDraftVersionCommand.execute({ userVersion: newDraft });
    },
    onDelete: async ({ transaction }) => {
      const draft = transaction.mutations[0].modified as UserVersion;
      await removeDraftCommand.execute({ userId: draft.data.id, versionId: draft.id });
    },
    onUpdate: async ({ transaction }) => {
      const draft = transaction.mutations[0].modified as UserVersion;
      await updateDraftCommand.execute({ userId: draft.data.id, version: draft });
    }
  })
)
