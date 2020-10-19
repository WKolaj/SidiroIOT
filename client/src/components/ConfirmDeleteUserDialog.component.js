import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import { setConfirmDeleteUserDialogOpen, setConfirmDeleteUserDialogUsername } from '../actions/ConfirmDeleteUserDialog.action';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import { setUserAccountsList } from '../actions/UserAccountsPage.action';
import { setSnackbarText, setSnackbarShown } from '../actions/Snackbar.action';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";

function AlertDialog(props) {
  const { t } = useTranslation();
  let history = useHistory();

  const deletePerm = () => {
    UserService.deleteAccount(props.accountIdToBeDeleted).then(res => {
      if (res.status === 200) {
        props.setConfirmDeleteUserDialogOpen(false);
        props.setSnackbarText(t('Snackbar.SuccessfulUserDeletion'));
        props.setSnackbarShown(true);
        //if edited account is currently logged in
        if (props.accountIdToBeDeleted === AuthService.getCurrentUser()._id) {
          AuthService.logout()
          history.push('/login')
        }
        else {
          UserService.getAllAccounts().then(res => {
            props.setUserAccountsList(res.data)
          })
        }
      }
      else if (res.status === 403) {
        props.setConfirmDeleteUserDialogOpen(false);
        props.setSnackbarText(t('Snackbar.Generic403'));
        props.setSnackbarShown(true);
      }
      else {
        props.setConfirmDeleteUserDialogOpen(false);
        props.setSnackbarText(t('Snackbar.UnknownError'));
        props.setSnackbarShown(true);
      }
    })
  }

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setConfirmDeleteUserDialogOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t('ConfirmDeleteUserDialog.Title')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('ConfirmDeleteUserDialog.AccountToBeDeleted')}<strong>{props.accountNameToBeDeleted}</strong>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => deletePerm()} color="secondary">
          {t('ConfirmDeleteUserDialog.Confirm')}
        </Button>
        <Button onClick={() => props.setConfirmDeleteUserDialogOpen(false)} color="primary" autoFocus>
          {t('ConfirmDeleteUserDialog.Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const mapStateToProps = (state) => {
  return {
    open: state.ConfirmDeleteUserDialogReducer.open,
    accountNameToBeDeleted: state.ConfirmDeleteUserDialogReducer.username,
    accountIdToBeDeleted: state.ConfirmDeleteUserDialogReducer.id
  }
}

const mapDispatchToProps = {
  setConfirmDeleteUserDialogOpen,
  setConfirmDeleteUserDialogUsername,
  setUserAccountsList,
  setSnackbarText,
  setSnackbarShown
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertDialog);