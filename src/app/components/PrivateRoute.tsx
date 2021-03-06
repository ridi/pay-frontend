import * as React from 'react';
import { connect } from 'react-redux';

import { CommonLoader } from 'app/components';
import { RootState } from 'app/store';
import { Omit } from 'app/types';

export interface PrivateRouteProps extends ReturnType<typeof mapStateToProps> {
  component: React.ComponentType;
}

export const PrivateRoute: React.SFC<PrivateRouteProps> = (props) => {
  const { isLoggedIn, component: Component, ...restProps } = props;

  if (!isLoggedIn) {
    location.replace('/');
    return <CommonLoader />;
  }

  return <Component {...restProps} />;
};

const mapStateToProps = (state: RootState) => {
  return {
    // isLoggedIn: state.user.isLoggedIn
    isLoggedIn: true,
  };
};

export const ConnectedPrivateRoute = connect(
  mapStateToProps,
  null,
  null,
  {
    pure: false
  }
)(PrivateRoute);
