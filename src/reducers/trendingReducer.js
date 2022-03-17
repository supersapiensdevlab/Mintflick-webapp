import { TRENDING_LOADED, TRENDING_LOADING } from '../actions/types';

const initialState = {
    trending:null,
    loading:false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TRENDING_LOADING:
      return {
        ...state,
        loading: true
      };

    case TRENDING_LOADED:
      return {
        ...state,
        trending: action.payload,
        loading:false
      };
    default:
      return state;
  }
}
