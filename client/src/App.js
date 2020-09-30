import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Drawer from './components/Drawer.component';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducers/rootReducer.reducer";

const store = createStore(rootReducer);

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink
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
        </Provider>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
