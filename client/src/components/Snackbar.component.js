import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { setSnackbarShown } from '../actions/Snackbar.action';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

function CustomizedSnackbars(props) {
  
  const classes = useStyles();
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.setSnackbarShown(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar open={props.shown} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={props.severity}>
          {props.text}
        </Alert>
      </Snackbar>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    text: state.SnackbarReducer.text,
    shown: state.SnackbarReducer.shown,
    severity: state.SnackbarReducer.severity
  }
}

const mapDispatchToProps = {
  setSnackbarShown
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomizedSnackbars);