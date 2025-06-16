import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { msalConfig } from './msalConfig';
import { PublicClientApplication } from '@azure/msal-browser';
import reportWebVitals from './reportWebVitals.ts';

// Polyfill for environments (like Office.js) where window.history.replaceState may not exist
if (typeof window !== 'undefined' && (!window.history || !window.history.replaceState)) {
  if (!window.history) window.history = {};
  window.history.replaceState = function() {};
}

const msalInstance = new PublicClientApplication(msalConfig);

async function renderApp() {
  await msalInstance.initialize();
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App msalInstance={msalInstance} />
    </React.StrictMode>
  );
}

// Wait for Office.js to be ready before rendering the app if available
if ((window as any).Office && (window as any).Office.onReady) {
  (window as any).Office.onReady().then(renderApp);
} else {
  renderApp();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
