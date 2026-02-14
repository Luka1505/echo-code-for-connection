import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { CheckInProvider } from './services/CheckInContext.jsx';
import { initializeUserId } from './services/userIdentity.js';

// Initialize anonymous user identity before rendering
initializeUserId();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CheckInProvider>
        <App />
      </CheckInProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
