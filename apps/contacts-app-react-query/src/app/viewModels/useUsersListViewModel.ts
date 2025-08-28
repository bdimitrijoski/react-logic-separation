import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { loadUsersPage } from '../commands/userCommands';
import { User } from '../types';
import { useSelectedUserId } from '../hooks/useSearchParam';

export function useUsersListViewModel() {
  const [search, setSearch] = useState('');
  const selectedUserId = useSelectedUserId();

  const [sortKey, setSortKey] = useState<keyof User>('name');
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['users', search, sortKey],
    initialPageParam: 1,
    queryFn:({ pageParam = 1 }) => loadUsersPage(pageParam, 10, search, sortKey),
     getNextPageParam: (lastPage, pages) => lastPage.nextPage,
     getPreviousPageParam: (firstPage, pages) => firstPage.prevPage,
   }
  );

  const users = data?.pages.flatMap(p => p.items) ?? [];

  return {
    users,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    search,
    setSearch,
    sortKey,
    setSortKey,
    refetch,
    selectedUserId,
  };
}
