import { applyMiddleware, createStore } from 'redux';

import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';

import reducer from './reducers';

export default function configureStore() {
  const middleware = applyMiddleware(promise(), thunk); // logger()
  return createStore(reducer, middleware);
}
