import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useUserDetailsViewModel } from '../viewModels/useUserDetailsViewModel';

export function DetailsPanel() {
  const { userId: idStr } = useParams();
  const userId = Number(idStr);
  const [searchParams, setSearchParams] = useSearchParams();
  const vm = useUserDetailsViewModel(userId);

  if (vm.isLoading) return <div>Loading details…</div>;
  if (vm.isError || !vm.currentData) return <div>Error loading user.</div>;

  return (
    <div style={{ flex: 1, padding: 16 }}>
      <Link to="/">← Back</Link>
      <h2>{vm.currentData.name}</h2>
      <div style={{ width: '500px' }}>
      <div style={{ width: '500px' }}>
        Version:{' '}
        <select
          value={vm.selectedVersion}
          onChange={e => {
            vm.setSelectedVersion(e.target.value);
            searchParams.set('version', e.target.value);
            setSearchParams(searchParams);
          }}
        >
          {vm.versions.map(v => (
            <option key={v.id} value={v.id}>
              {v.isDraft ? 'Draft' : 'Live'} – {new Date(v.timestamp).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {vm.currentData && (
        <form>
          <label>
            Name{' '}
            <input
              value={vm.currentData.name}
              className='cogs-input'
              onChange={e => vm.onChangeField('name', e.target.value)}
            />
          </label>
          <label>
            Email{' '}
            <input
              value={vm.currentData.email}
              className='cogs-input'
              onChange={e => vm.onChangeField('email', e.target.value)}
            />
          </label>
          {/* add other fields as needed */}
        </form>
      )}

      <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>

      {!vm.versions.some(v => v.isDraft) && (
        <button type='button' className='cogs-button secondary' onClick={vm.startEdit}>Edit</button>
      )}
      {vm.versions.some(v => v.isDraft) && (
        <>
          <button type='button' className='cogs-button primary' onClick={vm.onPublish}>Publish</button>
          <button type='button' className='cogs-button secondary' onClick={vm.onDeleteDraft}>Discard Draft</button>
        </>
      )}
      <button type='button' className='cogs-button secondary' onClick={vm.onDeleteUser}>Delete Contact</button>
      </div>

      </div>
      
    </div>
  );
}
