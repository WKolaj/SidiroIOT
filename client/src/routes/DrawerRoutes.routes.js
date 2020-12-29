import React from 'react';
import { Route, Switch } from "react-router-dom";
import Settings from '../components/Settings.component';
import DevicesSelectionPage from '../components/DevicesSelectionPage.component';
import AccountPage from '../components/AccountPage.component';
import UserAccountsPage from '../components/UserAccountsPage.component';
import AdminRoute from '../routes/ProtectedAdmin.routes';

export default function DrawerRoutes() {
  return (
    <Switch>
      <AdminRoute path="/settings"><Settings /></AdminRoute>
      <Route path="/myaccount" render={() => <AccountPage />} />
      <AdminRoute path="/useraccounts"><UserAccountsPage /></AdminRoute>
      <Route path="/" render={() => <DevicesSelectionPage />} />
    </Switch>
  )
}
