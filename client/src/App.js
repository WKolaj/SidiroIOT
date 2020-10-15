import React from 'react';
import './App.scss';
import { BrowserRouter as Router } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Drawer from './components/Drawer.component';
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducers/Root.reducer";
import './i18n';
import LanguageDialog from './components/LanguageSelectionDialog.component';
import CreateAccountDialog from './components/CreateAccountDialog.component';
import Snackbar from './components/Snackbar.component';
import ConfirmDeleteUserDialog from './components/ConfirmDeleteUserDialog.component';

const store = createStore(rootReducer);

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#33a095',
      main: '#00897b',
      dark: '#005f56',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#fff',
    },
  },
});

function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Drawer />
            <CreateAccountDialog/>
          </Router>
          <LanguageDialog/>
          <Snackbar/>
          <ConfirmDeleteUserDialog/>
        </Provider>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
