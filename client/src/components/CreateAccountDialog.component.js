import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import { connect } from 'react-redux';
import {
  setCreateAccountDialogOpen,
  setCreateAccountDialogNameTextfield,
  setCreateAccountDialogPasswordTextfield,
  setCreateAccountDialogPermissionsSelect,
  setCreateAccountDialogNameTextfieldError,
  setCreateAccountDialogPasswordTextfieldError,
  setCreateAccountDialogNewpasswordTextfield
} from '../actions/CreateAccountDialog.action';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import { useTranslation } from 'react-i18next';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import { setSnackbarText, setSnackbarShown } from '../actions/Snackbar.action';
import { setUserAccountsList } from '../actions/UserAccountsPage.action';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  form: {
    '& > *': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
}));

function CreateAccountDialog({ open,
  type,
  name,
  nameError,
  password,
  passwordError,
  permissions,
  editAccountId,
  setCreateAccountDialogOpen,
  setCreateAccountDialogNameTextfield,
  setCreateAccountDialogPasswordTextfield,
  setCreateAccountDialogPermissionsSelect,
  setCreateAccountDialogNameTextfieldError,
  setCreateAccountDialogPasswordTextfieldError,
  setSnackbarShown,
  setSnackbarText,
  setUserAccountsList }) {

  const classes = useStyles();
  const { t } = useTranslation();
  let history = useHistory();

  const handleChange = (event) => {
    const val = event.target.value;
    const name = event.target.name;
    setCreateAccountDialogPasswordTextfieldError(false)
    setCreateAccountDialogNameTextfieldError(false)

    if (name === 'name') {
      setCreateAccountDialogNameTextfield(val)
    }
    else if (name === 'password') {
      setCreateAccountDialogPasswordTextfield(val)
    }
    else if (name === 'newpassword') {
      setCreateAccountDialogNewpasswordTextfield(val)
    }
    else {
      setCreateAccountDialogPermissionsSelect(val)
    }
  }

  const disableButton = () => {
    if (type === 'edit') {
      if (password.length > 0 && password.length < 8) {
        return true
      }
    }
    else {
      if (password.length < 8 || name.length < 3) {
        return true
      }
    }
    return false
  }

  const register = () => {
    UserService.register(name, password, permissions).then(res => {
      if (res._id && res.name && res.permissions) {
        setSnackbarText(t('Snackbar.SuccessfulUserCreation'), 'success')
        setSnackbarShown(true)
        setCreateAccountDialogPasswordTextfield('')
        setCreateAccountDialogNameTextfield('')
        setCreateAccountDialogOpen(false)
        UserService.getAllAccounts().then(res => {
          setUserAccountsList(res)
        })
      }
      else {
        setCreateAccountDialogNameTextfieldError(true)
        setCreateAccountDialogPasswordTextfieldError(true)
      }
    })
  }

  const edit = () => {
    UserService.editAccount(editAccountId, name, permissions, password === '' ? false : password).then(res => {
      if (res._id) {
        setSnackbarText(t('Snackbar.SuccessfulUserEdit'), 'success')
        setCreateAccountDialogPasswordTextfield('')
        setCreateAccountDialogNameTextfield('')
        setSnackbarShown(true)
        setCreateAccountDialogOpen(false)
        UserService.getAllAccounts().then(res => {
          setUserAccountsList(res)
        })
        //if edited account is currently logged in
        if(res._id === AuthService.getCurrentUser()._id) {
          AuthService.logout()
          history.push('/login')
        }
      }
      else {
        setSnackbarText(t('Snackbar.UnsuccessfulUserEdit'), 'error')
        setSnackbarShown(true)
      }
    })
  }

  return (
    <Dialog open={open} onClose={() => setCreateAccountDialogOpen(false)} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{type === 'create' ? t('CreateAccountDialog.TitleCreate') : t('CreateAccountDialog.TitleEdit')}</DialogTitle>
      <DialogContent>
        {type === 'edit' ?
          <DialogContentText>
            {t('CreateAccountDialog.AccountBeingEditedSubtitle')}<strong>{editAccountId}</strong>
          </DialogContentText>
          : null}

        <form className={classes.form}>
        {AuthService.getCurrentUser()!==null?
          <div>
            <TextField
            disabled={type==='edit'? true: false}
            error={nameError}
            helperText={nameError ? t('LoginPage.InvalidLoginPassword') : t('LoginPage.FormLoginTextFieldHelperText')}
            onChange={handleChange}
            name="name"
            value={name}
            autoFocus
            margin="dense"
            id="name"
            label={t('CreateAccountDialog.NameTextField')}
            type="text"
            fullWidth
          />
          <TextField
            error={passwordError}
            helperText={passwordError ? t('LoginPage.InvalidLoginPassword') : t('LoginPage.FormPasswordTextFieldHelperText')}
            onChange={handleChange}
            autoComplete="off"
            value={password}
            name="password"
            margin="dense"
            id="password"
            label={t('CreateAccountDialog.PasswordTextField')}
            type="password"
            fullWidth
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="permissions">{t('CreateAccountDialog.PermissionsSelect')}</InputLabel>
            <Select
              fullWidth
              labelId="permissions"
              id="permissions-select"
              name="permissions"
              value={permissions}
              onChange={handleChange}
            >
              {AuthService.getCurrentUser().permissions >= 3 ? <MenuItem value={1}>User</MenuItem> : null}
              {AuthService.getCurrentUser().permissions === 7 ? <MenuItem value={3}>Admin</MenuItem> : null}
              {AuthService.getCurrentUser().permissions === 7 ? <MenuItem value={7}>SuperAdmin</MenuItem> : null}
            </Select>
          </FormControl>
          </div>
        :null}
          
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCreateAccountDialogOpen(false)} color="primary">
          {t('CreateAccountDialog.Cancel')}
        </Button>
        <Button disabled={disableButton()} onClick={() => type === 'edit' ? edit() : register()} color="primary">
          {type === 'create' ? t('CreateAccountDialog.Create') : t('CreateAccountDialog.Update')}
        </Button>
      </DialogActions>
    </Dialog >
  );
}

const mapStateToProps = (state) => {
  return {
    open: state.CreateAccountDialog.open,
    type: state.CreateAccountDialog.type,
    name: state.CreateAccountDialog.name,
    nameError: state.CreateAccountDialog.nameError,
    password: state.CreateAccountDialog.password,
    passwordError: state.CreateAccountDialog.passwordError,
    permissions: state.CreateAccountDialog.permissions,
    editAccountId: state.CreateAccountDialog.editAccountId
  }
}

const mapDispatchToProps = {
  setCreateAccountDialogOpen,
  setCreateAccountDialogNameTextfield,
  setCreateAccountDialogPasswordTextfield,
  setCreateAccountDialogPermissionsSelect,
  setCreateAccountDialogNameTextfieldError,
  setCreateAccountDialogPasswordTextfieldError,
  setSnackbarText,
  setSnackbarShown,
  setUserAccountsList,
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountDialog);