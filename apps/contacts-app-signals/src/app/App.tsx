import { Route, Routes } from 'react-router-dom';

import {
  DetailsPanel,
  DetailsPanelContext,
  ListPanel,
  ListPanelContextProvider,
} from 'contacts-app-core';
import { useUsersListViewModel } from './viewModels/useUsersListViewModel';
import { useUserDetailsViewModel } from './viewModels/useUserDetailsViewModel';

export function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ListPanelContextProvider useUsersListViewModel={useUsersListViewModel}>
        <ListPanel />
      </ListPanelContextProvider>
      <Routes>
        <Route
          path="/users/:userId"
          element={
            <DetailsPanelContext.Provider
              value={{ useUserDetailsViewModel: useUserDetailsViewModel }}
            >
              <DetailsPanel />
            </DetailsPanelContext.Provider>
          }
        />
        <Route path="*" element={<div>Select a contact</div>} />
      </Routes>
    </div>
  );
}
