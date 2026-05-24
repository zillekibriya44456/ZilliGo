import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { SettingsProvider } from './context/SettingsContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BookingProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </BookingProvider>
    </AuthProvider>
  </StrictMode>
);
