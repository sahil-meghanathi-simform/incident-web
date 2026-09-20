import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './app/AppProviders';
import { RootErrorBoundary } from './components/feedback/RootErrorBoundary';
import { router } from './app/router';
// Self-hosted fonts (no third-party request): Inter for body copy, Rajdhani for the
// display face — the families the @theme tokens in index.css were tuned for.
import '@fontsource-variable/inter';
import '@fontsource/rajdhani/500.css';
import '@fontsource/rajdhani/600.css';
import '@fontsource/rajdhani/700.css';
import './styles/index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <RootErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </RootErrorBoundary>
  </StrictMode>,
);
