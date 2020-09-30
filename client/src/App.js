import React from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Drawer from './components/Drawer.component';
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducers/Root.reducer";
import './i18n';
import LanguageDialog from './components/LanguageSelectionDialog.component';

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
          </Router>
          <LanguageDialog/>
        </Provider>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
