import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '../../queryClient';
import { useSignalValue } from '../lib/use-signal-value';
import { userFactoryService, usersApiService, draftVersionsService } from '../services';
import { UsersListViewModel } from './users-list.view-model';

export function useUsersListViewModel() {

  // initialize the view model only once
  // when the hook/view model is first used
  const model = useMemo(
    () =>
      new UsersListViewModel(queryClient, { usersService: usersApiService, draftsService: draftVersionsService }),
    []
  );
  const navigate = useNavigate();

  // Called when user hits "Create new User":
  const createNewDraftUser = async () => {
    const userId = Date.now();
    const draftUser = userFactoryService.createUser(Date.now(), {
      name: `New User ${userId}`,
      email: '',
      phone: '',
    });
    const draftVersion = userFactoryService.createDraftVersion(draftUser);
    // await draftsCollection.insert(draftVersion);
    navigate(`/users/${draftVersion.data.id}`);
  };

  return {
    users: useSignalValue(model.getCombinedFilteredUsers),
    isLoading: useSignalValue(model.isLoading),
    search: useSignalValue(model.searchQuery),
    setSearch: model.setSearchQuery.bind(model),
    createNewDraftUser,
  };
}
