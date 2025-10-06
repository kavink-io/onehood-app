import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { theme } from './theme.js';

// 1. Import Mantine provider and styles
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* 2. Wrap your app with MantineProvider */}
        <MantineProvider theme={theme}>
          <App />
        </MantineProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);