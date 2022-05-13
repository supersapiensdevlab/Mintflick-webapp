import { NFT_USER_DATA_LOADING,
    NFT_USER_DATA_LOADED } from '../actions/types';

const initialState = {
    users:[],
    loading:false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case NFT_USER_DATA_LOADING:
      return {
        ...state,
        loading: true
      };

    case NFT_USER_DATA_LOADED:
      return {
        ...state,
        users: [...state.users,action.payload],
        loading:false
      };
    default:
      return state;
  }
}
