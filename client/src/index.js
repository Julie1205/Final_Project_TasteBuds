import { Auth0Provider } from "@auth0/auth0-react";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-33lso-13.us.auth0.com"
      clientId="rqBQEgDYVt1tyTfpvot4CpIl3ZrxRg9B"
      redirectUri={"http://localhost:3000/home/explore"}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

