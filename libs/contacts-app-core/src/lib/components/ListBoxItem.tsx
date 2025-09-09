
import { Link } from 'react-router-dom';
import { User } from '../types';


export interface ListBoxItemProps {
    user: User;
    selectedUserId?: string;
    onDelete?: (user: User) => void;
}
export const ListBoxItem = ({ user, selectedUserId, onDelete }: ListBoxItemProps) => {
  return (
    <div
      key={user.id}
      className={`listbox-item ${
        selectedUserId === user.id.toString() ? 'selected' : ''
      }`}
    >
      <Link to={`/users/${user.id}`}>{user.name}</Link>
      {onDelete ? <button type='button' className='delete-btn' style={{ marginLeft: '10px'}} onClick={(e) => onDelete(user)}>x</button>: null}
    </div>
  );
};
