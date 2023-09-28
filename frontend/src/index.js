import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './components/AuthContext'; // Asegúrate de importar AuthProvider

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider> {/* Envuelve tu App con AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

