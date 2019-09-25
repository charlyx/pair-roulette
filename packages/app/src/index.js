import React from 'react';
import ReactDOM from 'react-dom';
import { FirebaseAuthProvider } from './firebase';
import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <FirebaseAuthProvider>
    <App />
  </FirebaseAuthProvider>
, document.getElementById('root'));

serviceWorker.unregister();
