import { EnvironmentActionTypes, SET_ENVIRONMENT } from 'app/services/environment/actions';
import { EnvironmentState, initialEnvironmentState } from 'app/services/environment/reducer.state';
import { Reducer } from 'redux';

export const environmentReducer: Reducer<EnvironmentState> = (
  state = initialEnvironmentState,
  action: EnvironmentActionTypes
) => {
  switch (action.type) {
    case SET_ENVIRONMENT: {
      return { ...state, ...action.payload!.environment };
    }
    default:
      return state;
  }
};
