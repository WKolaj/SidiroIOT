import React from 'react';
import { Route, Switch } from "react-router-dom";
import Settings from '../components/Settings.component';
import DevicesSelectionPage from '../components/DevicesSelectionPage.component';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/settings" component={Settings} />
      <Route path="/" component={DevicesSelectionPage} />
    </Switch>
  )
}
