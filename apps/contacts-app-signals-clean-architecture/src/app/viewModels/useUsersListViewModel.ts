import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignalValue } from '../lib/use-signal-value';
import { createDraftUserCommand, deleteDraftUserCommand, fetchUsersQuery } from '../services';
import { getUserIdFromPath } from '../utils/url-params';
import { UsersListViewModel } from './users-list.view-model';

/**
 * The ViewModels are exposed to the views via custom hooks.
 * The only thing that the hooks would do is to initialize the view model
 * and return the signals/derived signals that the view would use as raw values.
 */
export function useUsersListViewModel() {
  const navigate = useNavigate();

  // initialize the view model only once
  // when the hook/view model is first used
  const model = useMemo(
    () =>
      new UsersListViewModel({
        fetchUsersQuery,
        createDraftUser: createDraftUserCommand,
        deleteDraftUserCommand,
      }),
    []
  );

  // Called when user hits "Create new User":
  const createNewDraftUser = useCallback(() => {
    model.createNewDraftUser();
    // not fully finished, but we would need to navigate to the new user details page
    // navigate(`/users/${newUserId}`);
  }, [model]);


  return {
    users: useSignalValue(model.users),
    isLoading: useSignalValue(model.isLoading),
    search: useSignalValue(model.searchQuery),
    selectedUserId: getUserIdFromPath(),
    setSearch: model.setSearchQuery.bind(model),
    createNewDraftUser,
    deleteUser: model.deleteDraftUser.bind(model),
    loadMore: model.loadMoreUsers.bind(model)
  };
}
