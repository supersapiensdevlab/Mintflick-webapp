import toggleAudius from './toggleAudius';
import toggleDarkMode from './toggleDarkMode';
import toggleUserType from './toggleUserType';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  toggleDarkMode,
  toggleAudius,
  toggleUserType,
});

export default rootReducer;
