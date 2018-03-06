import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom'
import './index.css';

ReactDOM.render(
    // For browser based projects, there are <BrowserRouter> and <HashRouter> components. 
    // The <BrowserRouter> should be used when you have a server that will handle dynamic requests (knows how to respond to any possible URI), 
    // while the <HashRouter> should be used for static websites (can only respond to requests for files that it knows about).
    <BrowserRouter>  
        <App />
    </BrowserRouter>,
    document.getElementById('root'));
registerServiceWorker(); // For offline perfermance.

