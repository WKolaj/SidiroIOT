import React from 'react';
import { Route, Switch } from "react-router-dom";
import Settings from '../components/Settings.component';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/settings" component={Settings} />
    </Switch>
  )
}
