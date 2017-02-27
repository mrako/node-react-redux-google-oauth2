import React from 'react';
import ReactDOM from 'react-dom';

import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import routes from './routes';
import configureStore from './store';

const store = configureStore();
const app = document.getElementById('root');

const router = (
  <Provider store={store}>
    <Router history={browserHistory} routes={routes(store)} />
  </Provider>
);

ReactDOM.render(router, app);
