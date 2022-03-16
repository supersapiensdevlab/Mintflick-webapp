import { CREATE_PROVIDER, CLEAR_PROVIDER } from '../actions/types';

const initialState = {
  provider: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_PROVIDER:
      return {
        ...state,
        provider: action.payload,
      };

    case CLEAR_PROVIDER:
      return {
        ...state,
        provider: null,
      };

    default:
      return state;
  }
}
