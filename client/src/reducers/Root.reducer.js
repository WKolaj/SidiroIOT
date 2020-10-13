import { combineReducers } from 'redux';
import { LanguageDialogReducer } from './LanguageDialog.reducer';
import { UniversalTabsReducer } from './UniversalTabs.reducer';
import { DevicesListReducer } from './DevicesList.reducer';
import { LoginPageReducer } from './LoginPage.reducer';
import { AccountPageReducer } from './AccountPage.reducer';
import { HardwareUsageReducer } from './HardwareUsage.reducer';

export default combineReducers({
  LanguageDialogReducer,
  UniversalTabsReducer,
  DevicesListReducer,
  LoginPageReducer,
  AccountPageReducer,
  HardwareUsageReducer
})