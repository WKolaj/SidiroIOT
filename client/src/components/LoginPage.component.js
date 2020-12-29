import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import Fab from '@material-ui/core/Fab';
import LanguageIcon from "@material-ui/icons/Language";
import Zoom from '@material-ui/core/Zoom';
import { connect } from 'react-redux';
import { setLanguageDialogOpen } from '../actions/LanguageDialog.action';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AuthService from "../services/auth.service";
import { useHistory } from "react-router-dom";
import { setLoginFormUsernameError, setLoginFormPasswordError, setLoginFormUsername, setLoginFormPassword } from '../actions/LoginPage.action';
import { setSnackbarText, setSnackbarShown } from '../actions/Snackbar.action';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  contentDesktop: {
    //flexGrow: 1,
    padding: theme.spacing(1),
    height: '100vh',
    width: '100%'
  },
  contentMobile: {
    padding: theme.spacing(1),
    height: '100%',
    width: '100%'
  },
  loginButton: {
    marginTop: theme.spacing(3)
  },
  form: {
    '& > *': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
  fab: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

function LoginPage(props) {
  const classes = useStyles();
  const { t } = useTranslation()
  const theme = useTheme();
  const matches = useMediaQuery(`${theme.breakpoints.down('sm')} and (orientation: landscape)`)
  let history = useHistory();

  const tryLogin = () => {
    AuthService.login(props.login, props.password).then(() => {
      history.push("/");
    }).catch(() => {
      props.setLoginFormUsernameError(true)
      props.setLoginFormPasswordError(true)
      props.setLoginFormPassword("")
      props.setSnackbarText(t('Snackbar.LoginFailed'), 'error')
      props.setSnackbarShown(true)
    })
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && props.login.length >= 1 && props.password.length >= 1) {
      tryLogin()
    }
  }

  const buttonLogin = () => {
    tryLogin()
  }

  const controlFormFields = (field, value) => {
    props.setLoginFormUsernameError(false)
    props.setLoginFormPasswordError(false)
    if (field === 'username') {
      props.setLoginFormUsername(value)
    }
    else {
      props.setLoginFormPassword(value)
    }
  }

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return (
    <React.Fragment>
      <Zoom
        in={true}
        timeout={transitionDuration}
        style={{
          transitionDelay: `500ms`,
        }}
        unmountOnExit
      >
        <Tooltip title={t('LoginPage.Language')} placement="bottom">
          <Fab aria-label="choose langauge" className={classes.fab} color="primary" onClick={() => props.setLanguageDialogOpen(true)}>
            <LanguageIcon />
          </Fab>
        </Tooltip>
      </Zoom>

      <Fade in={true}>
        <Grid className={matches ? classes.contentMobile : classes.contentDesktop}
          container
          spacing={0}
          direction="row"
          justify="center"
          alignItems="center"
          alignContent="center">
          <Grid item xs={12} >
            <Typography align="center" variant="h2" gutterBottom>SidiroIOT</Typography>
          </Grid>
          <Grid item xs={12} >
            <Typography align="center" variant="h4" gutterBottom>{t('LoginPage.LoginTitle')}</Typography>
          </Grid>
          <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
            <form noValidate autoComplete="off" className={classes.form}>
              <TextField
                error={props.loginError}
                value={props.login}
                onChange={(e) => controlFormFields('username', e.target.value)}
                id="login" label={t('LoginPage.FormLoginTextField')} fullWidth variant="standard" autoComplete="username" onKeyDown={handleKeyDown} />
              <TextField
                error={props.passwordError}
                value={props.password}
                onChange={(e) => controlFormFields('password', e.target.value)}
                id="password" type="password" label={t('LoginPage.FormPasswordTextField')} fullWidth variant="standard" autoComplete="password" onKeyDown={handleKeyDown} />
            </form>
            <Button onClick={() => buttonLogin()} className={classes.loginButton} color="primary" variant="contained" fullWidth disabled={props.login.length < 1 || props.password.length < 1}>{t('LoginPage.LoginButton')}</Button>
          </Grid>
        </Grid>
      </Fade>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    login: state.LoginPageReducer.username,
    loginError: state.LoginPageReducer.usernameError,
    password: state.LoginPageReducer.password,
    passwordError: state.LoginPageReducer.passwordError
  }
}

const mapDispatchToProps = {
  setLanguageDialogOpen,
  setLoginFormPassword,
  setLoginFormUsername,
  setLoginFormUsernameError,
  setLoginFormPasswordError,
  setSnackbarText,
  setSnackbarShown
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);