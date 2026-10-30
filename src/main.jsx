import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { PermissionProvider } from './context/PermissionContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <PermissionProvider>
            <AuthProvider>
              <ProductProvider>
                <App />
              </ProductProvider>
            </AuthProvider>
          </PermissionProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
