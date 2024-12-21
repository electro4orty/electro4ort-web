import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/components/app.tsx';
import '@fontsource/inter';
import './index.css';

const rootElem = document.getElementById('root');

if (!rootElem) {
  throw new Error('#root not found');
}

createRoot(rootElem).render(
  <StrictMode>
    <App />
  </StrictMode>
);
