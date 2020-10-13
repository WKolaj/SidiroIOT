import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { connect } from 'react-redux';
import { setAccountFormCurrentPassword, setAccountFormNewPassword } from '../actions/AccountPage.action';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: 'center'
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
}))

function AccountPage({ currentPassword, newPassword, setAccountFormCurrentPassword, setAccountFormNewPassword }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const verify = (textfield) => {
    const lengthErrorText = t('AccountPage.PasswordHelperError8characters');
    const similarityErrorText = t('AccountPage.PasswordHelperErrorSamePasswords');
    if (textfield === 'currentPassword') {
      if (currentPassword.length > 0 && currentPassword.length < 8) {
        return {
          error: true,
          text: lengthErrorText
        }
      }
    }
    else {
      if (newPassword.length > 0 && newPassword.length < 8) {
        return {
          error: true,
          text: lengthErrorText
        }
      }
    }
    if (newPassword.length > 0 && currentPassword.length > 0 && newPassword === currentPassword) {
      return {
        error: true,
        text: similarityErrorText
      }
    }
    return {
      error: false,
      text: ''
    }
  }

  const changePassword = () => {
    //reset fields after submit
    setAccountFormCurrentPassword('')
    setAccountFormNewPassword('')
  }

  return (
    <div className={classes.root}>
      <Grid container
        spacing={2}
        direction="row"
        justify="center"
        alignItems="center"
        alignContent="center"
      >
        <Grid item xs={12}>
          <Typography variant="h4">{t('AccountPage.Title')}</Typography>
        </Grid>
        <Grid container
          justify="center"
          alignItems="center"
          alignContent="center"
          item xs={12}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
            {/* {props.userAccount.permissions & 1 === 1 ? <Chip avatar={<Avatar>U</Avatar>} label="User" /> : null}
            {props.userAccount.permissions & 3 === 3 ? <Chip color="primary" avatar={<Avatar>A</Avatar>} label="Admin" /> : null}
            {props.userAccount.permissions & 7 === 7 ? <Chip color="secondary" avatar={<Avatar>S</Avatar>} label="SuperAdmin" /> : null} */}
            <Chip avatar={<Avatar>U</Avatar>} label="User" />
            <Chip color="primary" avatar={<Avatar>A</Avatar>} label="Admin" />
            <Chip color="secondary" avatar={<Avatar>S</Avatar>} label="SuperAdmin" />
          </Grid>
        </Grid>
        <Grid container
          justify="center"
          alignItems="center"
          alignContent="center"
          item xs={12}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
            <form className={classes.form} noValidate autoComplete="off">
              <TextField fullWidth disabled label="ID" defaultValue="12345" />
              <TextField fullWidth disabled label={t('AccountPage.NameTextField')} autoComplete="username" defaultValue="qwerty" />
              <TextField type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setAccountFormCurrentPassword(e.target.value)} fullWidth label={t('AccountPage.CurrentPasswordTextField')} helperText={verify('currentPassword').text} error={verify('currentPassword').error} />
              <TextField type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setAccountFormNewPassword(e.target.value)} fullWidth label={t('AccountPage.NewPasswordTextField')} helperText={verify('newPassword').text} error={verify('newPassword').error} />
            </form>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
          <Button onClick={() => changePassword()}
            className={classes.loginButton} fullWidth color="secondary" variant="contained" disabled={currentPassword.length === 0 || newPassword.length === 0 || verify('newPassword').error || verify('currentPassword').error}>{t('AccountPage.ChangePasswordButton')}</Button>
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    currentPassword: state.AccountPageReducer.currentPassword,
    newPassword: state.AccountPageReducer.newPassword
  }
}

const mapDispatchToProps = {
  setAccountFormCurrentPassword,
  setAccountFormNewPassword
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage);