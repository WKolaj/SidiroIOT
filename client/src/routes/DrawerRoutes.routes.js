import React from 'react';
import { Route, Switch } from "react-router-dom";
import Settings from '../components/Settings.component';
import DevicesSelectionPage from '../components/DevicesSelectionPage.component';
import AccountPage from '../components/AccountPage.component';

export default function DrawerRoutes() {
  return (
    <Switch>
      <Route path="/settings" render={()=><Settings/>} />
      <Route path="/account" render={()=><AccountPage/>} />
      <Route path="/" render={()=><DevicesSelectionPage/>} />
    </Switch>
  )
}
