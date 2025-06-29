import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Starting React application...');

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1 style="color: red;">Error: Root element not found</h1>
      <p>The application could not start because the root element is missing.</p>
      <p>Please check that the HTML file contains: &lt;div id="root"&gt;&lt;/div&gt;</p>
    </div>
  `;
} else {
  console.log('Root element found, creating React app...');
  
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('React app rendered successfully');
  } catch (error) {
    console.error('Error rendering React app:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h1 style="color: red;">Application Error</h1>
        <p>The application failed to start.</p>
        <p style="color: #666; font-size: 14px;">Error: ${error.message}</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; margin-top: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
}