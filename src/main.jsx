import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './api.js'; // Initialize global API base URL configuration
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';

// Configure Base API URL for cloud deployment (e.g. Render / Vercel)
if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

