import { Dispatch } from 'react-redux';
import { routerMiddleware, routerReducer, RouterState } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

import { env, history } from 'app/config';
import { environmentReducer, environmentSaga, EnvironmentState } from 'app/services/environment';
import { userReducer } from 'app/services/user/userReducer';
import { userSaga } from 'app/services/user/userSaga';
import { trackingReducer } from './services/tracking/trackingReducer';
import { trackingSaga } from './services/tracking/trackingSaga';
import { voidSaga } from './services/void/voidSaga';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

function* rootSaga(dispatch: Dispatch<RootState>) {
  yield all([userSaga(), trackingSaga(), environmentSaga(), voidSaga()]);
}

const composeEnhancers = env.isDevelopment
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  : compose;
const sagaMiddleware = createSagaMiddleware();

const reducers = combineReducers({
  router: routerReducer,
  user: userReducer,
  environment: environmentReducer,
  tracking: trackingReducer
});

export type RootState = ReturnType<typeof reducers>;

const enhancers = composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware));

export const store = createStore(reducers, enhancers);

sagaMiddleware.run(rootSaga, store.dispatch);
