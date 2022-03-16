import {
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_EXISTS,
  USER_LOADED,
  USER_LOADING,
} from '../actions/types';

const initialState = {
  authtoken: localStorage.getItem('authtoken'),
  isAuthenticated: null,
  isLoading: false,
  user: null,
  error: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('authtoken', action.payload.jwtToken);
      return {
        ...state,
        user: action.payload.user,
        authtoken: action.payload.jwtToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case USER_EXISTS:
      return {
        ...state,
        error: action.payload,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem('authtoken');
      return {
        ...state,
        authtoken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}
