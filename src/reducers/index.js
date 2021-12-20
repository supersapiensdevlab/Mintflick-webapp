import toggleAudius from './toggleAudius';
import toggleDarkMode from './toggleDarkMode';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  toggleDarkMode,
  toggleAudius,
});

export default rootReducer;
