import * as types from '../actions/types';

export default function authReducer(state = {
  user: JSON.parse(localStorage.getItem('user')),
  message: '',
  error: '',
}, action) {
  switch (action.type) {
    case types.LOGIN_SUCCESS: {
      return {
        ...state,
        user: action.payload,
        error: '',
      };
    }
    case types.LOGIN_FAILURE: {
      return {
        ...state,
        user: null,
        error: action.payload,
      };
    }
    case types.LOGOUT_SUCCESS: {
      return {
        ...state,
        user: null,
      };
    }
    case types.CLEAR_AUTH_MESSAGE: {
      return {
        ...state,
        message: '',
        error: '',
      };
    }
    default: {
      return state;
    }
  }
}
