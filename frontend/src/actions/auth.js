import { browserHistory } from 'react-router';

import * as types from './types';

import Api from '../middleware/api';

function loginSuccess(data) {
  return {
    type: types.LOGIN_SUCCESS,
    payload: data,
  };
}

function loginFailure(error) {
  return {
    type: types.LOGIN_FAILURE,
    payload: error,
  };
}

function logoutSuccess() {
  return { type: types.LOGOUT_SUCCESS };
}

function logoutFailure(error) {
  return {
    type: types.LOGOUT_FAILURE,
    payload: error,
  };
}

export function clearUserNotification() {
  return { type: types.CLEAR_AUTH_MESSAGE };
}

function getErrorMessage(error) {
  return (error.response) ? error.response.data.userMessage : error.message;
}

export function login(credentials) {
  return (dispatch) => {
    Api.getClient().post('/google/signin', { id_token: credentials.tokenId })
      .then((response) => {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        dispatch(loginSuccess(response.data.user));
        browserHistory.push('/');
      })
      .catch((error) => {
        dispatch(loginFailure(getErrorMessage(error)));
      });
  };
}

export function logout() {
  return (dispatch) => {
    Api.getClient().get('/logout')
      .then(() => {
        localStorage.removeItem('user');
        dispatch(logoutSuccess());
        browserHistory.replace('/login');
      })
      .catch((error) => {
        dispatch(logoutFailure(error));
      });
  };
}
