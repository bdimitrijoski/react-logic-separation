import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ListPanel } from './components/ListPanel';
import { DetailsPanel } from './components/DetailsPanel';

export function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ListPanel />
      <Routes>
        <Route path="/users/:userId" element={<DetailsPanel />} />
        <Route path="*" element={<div>Select a contact</div>} />
      </Routes>
    </div>
  );
}
