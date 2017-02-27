import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';

import LoginPage from './containers/LoginPage';
import LogoutPage from './containers/LogoutPage';
import HomePage from './containers/HomePage';

const requireAuthentication = store => (nextState, replaceState) => {
  const state = store.getState();
  if (!state.auth.user) {
    replaceState({ pathname: '/login', nextPathname: nextState.location.pathname });
  }
};

export default store => (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} onEnter={requireAuthentication(store)} />

    <Route path="login" component={LoginPage} />
    <Route path="logout" component={LogoutPage} />
  </Route>
);
