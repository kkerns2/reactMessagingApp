//=========================================================
//index.js file
//Written By: Keegan Kerns
//Last Updated: Nov 27 2020
//Purpose: This is reacts start point for rendering the app components,
//         server class references here.
//==========================================================

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

//Renders the app enviornment
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
