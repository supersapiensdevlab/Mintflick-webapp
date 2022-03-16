import toggleAudius from './toggleAudius';
import toggleDarkMode from './toggleDarkMode';
import toggleUserType from './toggleUserType';
import User from './userReducer';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  toggleDarkMode,
  toggleAudius,
  toggleUserType,
  User
});

export default rootReducer;
