import { isAdmin } from '../services/isAuthenticated.service';
import React from "react";
import {
  Route,
  Redirect,
} from "react-router-dom";
import { setAuthenticated } from '../actions/Authentication.action';
import { connect } from 'react-redux';


function AdminRoute({ children, authenticated, setAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAdmin() ? (
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminRoute);