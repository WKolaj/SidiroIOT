import { isAuthenticated } from '../services/isAuthenticated.service';
import React from "react";
import {
  Route,
  Redirect,
} from "react-router-dom";
import { setAuthenticated } from '../actions/Authentication.action';
import { connect } from 'react-redux';


function PrivateRoute({ children, authenticated, setAuthenticated, ...rest }) {
  React.useEffect(() => {
    if (isAuthenticated()) {
      setAuthenticated(true)
    }
  }, [authenticated, setAuthenticated])
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated() ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.AuthenticationReducer.authed
  }
}

const mapDispatchToProps = {
  setAuthenticated
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);