import { useParams, Link } from 'react-router-dom';
import { useContext } from 'react';
import { DetailsPanelContext } from '../context/DetailsPanelContext';

export function DetailsPanel() {
    const { userId } = useParams<{ userId: string }>();
    const { useUserDetailsViewModel } = useContext(DetailsPanelContext);
  const vm = useUserDetailsViewModel(Number(userId));

  if (!vm.current) return <div>Loading…</div>;

  return (
    <section style={{ flex: 1, padding: 16 }}>
      <Link to="/">← Back</Link>
      <h2>{vm.current.name}</h2>

      <div style={{ width: '500px' }}>
        <label>
          Version{' '}
          <select
            value={vm.selectedId}
            onChange={(e) => vm.setSelectedId(e.target.value)}
          >
            {vm.versions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.isDraft ? 'Draft' : 'Live'} –{' '}
                {new Date(v.timestamp).toLocaleString()}
              </option>
            ))}
          </select>
        </label>

        <form>
          <label>
            Name{' '}
            <input
              value={vm.current.name}
              className="cogs-input"
              onChange={(e) => vm.onChangeField('name', e.target.value)}
            />
          </label>
          <label>
            Email{' '}
            <input
              value={vm.current.email}
              className="cogs-input"
              onChange={(e) => vm.onChangeField('email', e.target.value)}
            />
          </label>
        </form>

        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          {!vm.versions.some((v) => v.isDraft) && (
            <button type='button' className='cogs-button secondary' onClick={vm.startEdit}>Edit</button>
          )}
          {vm.versions.some((v) => v.isDraft) && (
            <>
              <button type='button' className='cogs-button primary' onClick={vm.onPublish}>Publish</button>
              <button type='button' className='cogs-button secondary' onClick={vm.onDiscard}>Discard Draft</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
