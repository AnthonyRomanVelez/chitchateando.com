import React from 'react';
// Import createRoot from 'react-dom/client'
import { createRoot } from 'react-dom/client';
import App from './App';

// Get the root element
const rootElement = document.querySelector('#root');

// Create a root and render the App component
const root = createRoot(rootElement);
root.render(<App />);