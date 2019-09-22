import React from 'react';
import ReactDOM from 'react-dom';
import { FirebaseAppProvider } from '@use-firebase/app';
import { FirebaseAuthProvider } from '@use-firebase/auth';
import config from './config.json';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <FirebaseAppProvider config={config}>
    <FirebaseAuthProvider>
    <App />
    </FirebaseAuthProvider>
  </FirebaseAppProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
