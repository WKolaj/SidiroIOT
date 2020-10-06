import { combineReducers } from 'redux';
import { LanguageDialogReducer } from './LanguageDialog.reducer';
import { UniversalTabsReducer } from './UniversalTabs.reducer';
import { DevicesListReducer } from './DevicesList.reducer';

export default combineReducers({
  LanguageDialogReducer,
  UniversalTabsReducer,
  DevicesListReducer
})