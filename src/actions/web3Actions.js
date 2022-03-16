import { tokenConfig } from '../helper/tokenConfig';
import { CREATE_PROVIDER, CLEAR_PROVIDER } from './types';
import axios from '../https-common';

export const createProvider = (provider) => (dispatch) => {
  // User loading
  dispatch({ type: CREATE_PROVIDER, payload: provider });
};

export const clearProvider = (provider) => (dispatch) => {
  // User loading
  dispatch({ type: CLEAR_PROVIDER });
};
