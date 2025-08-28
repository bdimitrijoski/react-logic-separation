import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'

import { User } from 'contacts-app-core'
import { queryClient } from '../../queryClient'
import { createUserCommand, updateUserCommand } from '../commands/userCommands'
import { usersApiService } from '../services'

export const usersCollection = createCollection(
  queryCollectionOptions<User>({
    queryKey: ['users'],
    queryFn: () => usersApiService.fetchUsers(),
    getKey: user => user.id,
    queryClient,
    onInsert: async ({ transaction }) => {
      const newUser = transaction.mutations[0].modified;
      await createUserCommand.execute({ user: newUser });
    },
    onUpdate: async ({ transaction }) => {
      const updatedUser = transaction.mutations[0].modified;
      await updateUserCommand.execute({ user: updatedUser });
    },
    onDelete: async ({ transaction }) => {
      const id = transaction.mutations[0].key as number
      await usersApiService.deleteUser(id)
    },
  })
)
