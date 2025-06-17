import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
// import { msalConfig } from './msalConfig';
// import { PublicClientApplication } from '@azure/msal-browser';
// TODO: Import Firebase config
import reportWebVitals from './reportWebVitals.ts';


// const msalInstance = new PublicClientApplication(msalConfig);
// TODO: Initialize Firebase app here

async function renderApp() {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

renderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
