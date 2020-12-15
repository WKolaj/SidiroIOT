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
      light: '#41aaaa',
      main: '#009999',
      dark: '#00646e',
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
            <ConfirmDeleteUserDialog/>
          </Router>
          <LanguageDialog/>
          <Snackbar/>
        </Provider>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
