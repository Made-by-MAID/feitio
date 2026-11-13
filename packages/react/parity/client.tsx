import { hydrateRoot } from 'react-dom/client';
import { App } from './app.tsx';

const page = window as Window & { hydrationErrors?: string[] };
page.hydrationErrors = [];
const root = document.getElementById('app');
if (root)
  hydrateRoot(root, <App />, {
    onRecoverableError: (error) => page.hydrationErrors?.push(String(error)),
  });
