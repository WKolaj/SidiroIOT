import { combineReducers } from 'redux';
import { LanguageDialogReducer } from './LanguageDialog.reducer';
import { UniversalTabsReducer } from './UniversalTabs.reducer';
import { DevicesListReducer } from './DevicesList.reducer';
import { LoginPageReducer } from './LoginPage.reducer';
import { AccountPageReducer } from './AccountPage.reducer';
import { HardwareUsageReducer } from './HardwareUsage.reducer';
import { AuthenticationReducer } from './Authentication.reducer';
import { CreateAccountDialog } from './CreateAccountDialog.reducer';
import { UserAccountsPageReducer } from './UserAccountsPage.reducer';
import { SnackbarReducer } from './Snackbar.reducer';
import { ConfirmDeleteUserDialogReducer } from './ConfirmDeleteUserDialog.reducer';
import { DevicesSelectionPageReducer } from './DevicesSelectionPage.reducer';
import { SettingsReducer } from './Settings.reducer';
import { BackdropReducer } from './Backdrop.reducer';

export default combineReducers({
  LanguageDialogReducer,
  UniversalTabsReducer,
  DevicesListReducer,
  LoginPageReducer,
  AccountPageReducer,
  HardwareUsageReducer,
  AuthenticationReducer,
  CreateAccountDialog,
  UserAccountsPageReducer,
  SnackbarReducer,
  ConfirmDeleteUserDialogReducer,
  DevicesSelectionPageReducer,
  SettingsReducer,
  BackdropReducer
})