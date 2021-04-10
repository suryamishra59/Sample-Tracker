import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './App';
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
    <SnackbarProvider
        maxSnack={4}
        autoHideDuration={4000}
        preventDuplicate
    >
        <App />
    </SnackbarProvider>,
    document.getElementById('root'));

serviceWorker.register();