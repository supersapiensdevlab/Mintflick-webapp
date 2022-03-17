import { tokenConfig } from '../helper/tokenConfig';
import {
TRENDING_LOADING,
TRENDING_LOADED
} from './types';
import axios from '../https-common';

export const loadTrending = () => (dispatch) => {
  // User loading
  dispatch({ type: TRENDING_LOADING });

  axios
    .get('/trending', tokenConfig())
    .then((res) => {
      dispatch({
        type: TRENDING_LOADED,
        payload: res.data.trending.reverse()
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

