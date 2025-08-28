
import { Link } from 'react-router-dom';
import { User } from '../types';


export interface ListBoxItemProps {
    user: User;
    selectedUserId?: string;
}
export const ListBoxItem = ({ user, selectedUserId }: ListBoxItemProps) => {
  return (
    <div
      key={user.id}
      className={`listbox-item ${
        selectedUserId === user.id.toString() ? 'selected' : ''
      }`}
    >
      <Link to={`/users/${user.id}`}>{user.name}</Link>
    </div>
  );
};
