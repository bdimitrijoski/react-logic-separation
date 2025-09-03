import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignalValue } from '../lib/use-signal-value';
import {
  createDraftUserCommand,
  draftVersionsService,
  usersRepository
} from '../services';
import { UsersListViewModel } from './users-list.view-model';
import { User } from 'contacts-app-core';

export function useUsersListViewModel() {
  // initialize the view model only once
  // when the hook/view model is first used
  const model = useMemo(
    () =>
      new UsersListViewModel({
        usersRepository,
        draftsService: draftVersionsService,
        createDraftUser: createDraftUserCommand,
      }),
    []
  );
  const navigate = useNavigate();

  // Called when user hits "Create new User":
  const createNewDraftUser = () => {
    model.createNewDraftUser();
    // not fully finished, but we would need to navigate to the new user details page
    // navigate(`/users/${newUserId}`);
  };

  return {
    users: useSignalValue(model.usersQueryResult.data),
    isLoading: useSignalValue(model.usersQueryResult.isLoading),
    search: useSignalValue(model.searchQuery),
    setSearch: model.setSearchQuery.bind(model),
    createNewDraftUser,
  };
}
