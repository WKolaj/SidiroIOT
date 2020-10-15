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
import { setUserAccountsList } from '../actions/UserAccountsPage.action';
import { setSnackbarText, setSnackbarShown } from '../actions/Snackbar.action';
import { useTranslation } from 'react-i18next';

 function AlertDialog(props) {

  const { t } = useTranslation();
  const deletePerm = () => {
    UserService.deleteAccount(props.accountIdToBeDeleted).then(res=>{
      props.setConfirmDeleteUserDialogOpen(false)
      props.setSnackbarText(t('Snackbar.SuccessfulUserDeletion'))
      props.setSnackbarShown(true)
      UserService.getAllAccounts().then(res=>{
        props.setUserAccountsList(res)
      })
    })
  }

  return (
      <Dialog
        open={props.open}
        onClose={()=>props.setConfirmDeleteUserDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Please confirm deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`The following account is going to be deleted:`} <strong>{props.accountNameToBeDeleted}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>deletePerm()} color="secondary">
            Confirm
          </Button>
          <Button onClick={()=>props.setConfirmDeleteUserDialogOpen(false)} color="primary" autoFocus>
            Close
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