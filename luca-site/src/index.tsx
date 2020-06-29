import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Api, { DbContext } from './util/api';
import * as serviceWorker from './serviceWorker';
import { ordersContext } from './util/orders';
import orders from './util/orders';

const Orders: orders = new orders();
const api: Api = new Api();

ReactDOM.render(
  <React.StrictMode>
    <DbContext.Provider value = {api}>
      <ordersContext.Provider value = {Orders} >
        <App />
      </ordersContext.Provider>
    </DbContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
