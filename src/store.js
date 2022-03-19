import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const middleWare = [thunk];
const initialState = {};

let store = null;
if (process.env.NODE_ENV === 'development') {
  store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleWare),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    ),
  );
} else {
  store = createStore(rootReducer, initialState, compose(applyMiddleware(...middleWare)));
}

export default store;
