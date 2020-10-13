import { isAuthenticated } from '../services/isAuthenticated.service';
import React from "react";
import {
  Route,
  Redirect,
} from "react-router-dom";

export default function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated('ROLE_USERS8') ? (
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
