import { useSearchParams } from 'react-router-dom';
import { useUsersListViewModel } from '../viewModels/useUsersListViewModel';
import { ListBoxItem } from './ListBoxItem';

export function ListPanel() {
  const {
    users,
    isLoading,
    isError,
    search,
    setSearch,
    selectedUserId
  } = useUsersListViewModel();

  const [, setParams] = useSearchParams();


  if (isError) return <div>Failed to load users.</div>;

  return (
    <div className='listbox' >
      <input
        type="text"
        placeholder="Search…"
        className='cogs-input'
        value={search}
        onChange={e => setSearch(e.target.value)}
        onBlur={() => setParams({ q: search })}
      />
      {users.map((user) => (
        <ListBoxItem
          key={user.id}
          user={user}
          selectedUserId={selectedUserId}
        />
      ))}
      {isLoading && <div>Loading…</div>}
    </div>
  );
}
