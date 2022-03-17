import { tokenConfig } from '../helper/tokenConfig';
import {
  AUTH_ERROR,
  FOLLOW_USER,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  USER_EXISTS,
  USER_LOADED,
  USER_LOADING,
  CREATE_POST
} from './types';
import axios from '../https-common';

export const loadUser = () => (dispatch) => {
  // User loading
  dispatch({ type: USER_LOADING });

  axios
    .get('/user/getLoggedInUser', tokenConfig())
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const register =
  ({ wallet_id, name, username, email, password }) =>
  (dispatch) => {
    // headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    //request body
    const body = JSON.stringify({ wallet_id, name, username, email, password });

    axios
      .post('/user/add', body, config)
      .then((res) => {
        if (res.data === 'Email' || res.data === 'Username') {
          dispatch({ type: USER_EXISTS, payload: res.data });
        } else {
          dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data,
          });
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

export const login =
  ({ username, password }) =>
  (dispatch) => {
    // headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    //request body
    const body = JSON.stringify({ username, password });

    axios
      .post('/user/login', body, config)
      .then((res) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

// logout user
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};

export const web3Login = (userData) => (dispatch) => {
  dispatch({
    type: LOGIN_SUCCESS,
    payload: userData,
  });
};

export const followUser = (data) => (dispatch) => {
  axios.post('/user/follow', data, tokenConfig())
    .then(function (response) {
      if (response) {
        dispatch({
          type: FOLLOW_USER,
          payload: data.following,
        });
      } 
    })
    .catch(function (error) {
      console.log(error);
    });
};


