import { QueryClientProvider } from '@tanstack/react-query';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';


import { App } from './app/App';
import { queryClient } from './queryClient';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </QueryClientProvider>
);
