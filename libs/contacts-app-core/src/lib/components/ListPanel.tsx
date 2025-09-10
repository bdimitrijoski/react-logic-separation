// import { useUsersListViewModel } from '../viewModels/useUsersListViewModel'
import { useContext } from 'react';
import { ListBoxItem } from './ListBoxItem';
import { ListPanelContext } from '../context/ListPanelContext';

export function ListPanel() {
  const { useUsersListViewModel } = useContext(ListPanelContext);
  const { users, isLoading, search, selectedUserId, setSearch, createNewDraftUser, deleteUser, loadMore } =
    useUsersListViewModel();

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <aside className="listbox">
      <button
        className="cogs-button secondary"
        style={{ marginBottom: 8, float: 'right' }}
        title="Create new contact"
        onClick={createNewDraftUser}
      >
        +
      </button>
      <input
        placeholder="Search…"
        value={search}
        className="cogs-input"
        onChange={(e) => setSearch(e.target.value)}
      />
      {users.map((u) => (
        <ListBoxItem user={u} key={u.id.toString()} selectedUserId={selectedUserId} onDelete={deleteUser} />
      ))}

      {loadMore ?  <button type='button' onClick={() => loadMore(2)}>Load more</button>: null}
      
    </aside>
  );
}
