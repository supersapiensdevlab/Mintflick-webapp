import { tokenConfig } from '../helper/tokenConfig';
import {
  NFT_USER_DATA_LOADING,
  NFT_USER_DATA_LOADED
} from './types';
import axios from '../https-common';

export const loadNFTUserData =  (data) => async (dispatch) => {
  // User loading
  // dispatch({ type: NFT_USER_DATA_LOADING });
      dispatch({
        type: NFT_USER_DATA_LOADED,
        payload:data
      });
};
