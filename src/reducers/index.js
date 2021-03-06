import toggleAudius from './toggleAudius';
import toggleDarkMode from './toggleDarkMode';
import toggleUserType from './toggleUserType';
import User from './userReducer';
import Trending from './trendingReducer'
import { combineReducers } from 'redux';
import web3Reducer from './web3Reducer';
import nftUserData from './nftUsersDataReducer';

const rootReducer = combineReducers({
  toggleDarkMode,
  toggleAudius,
  toggleUserType,
  User,
  web3Reducer,
  Trending,
  nftUserData
});

export default rootReducer;
