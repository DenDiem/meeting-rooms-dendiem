import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';

import { appRouter } from './app/app.routes';
import { store } from './store/store';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('The #root container is missing from index.html');
}

createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  </StrictMode>,
);
