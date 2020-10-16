import React, { useEffect, useCallback } from 'react';
import UniversalTable from './UniversalTable.component';
import { connect } from 'react-redux';
import { setUserAccountsList } from '../actions/UserAccountsPage.action';
import UserService from '../services/user.service';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { setCreateAccountDialogOpen, setCreateAccountDialogEditId, setCreateAccountDialogNameTextfield, setCreateAccountDialogPermissionsSelect} from '../actions/CreateAccountDialog.action';
import { useTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import { setConfirmDeleteUserDialogOpen, setConfirmDeleteUserDialogUsername } from '../actions/ConfirmDeleteUserDialog.action';
import AuthService from '../services/auth.service';

const useStyles = makeStyles((theme) => ({
  icons: {
    padding: theme.spacing(1)
  },
}));

function UserAccountsPage({ setUserAccountsList, 
  setCreateAccountDialogOpen, 
  accountsList, 
  setConfirmDeleteUserDialogOpen, 
  setConfirmDeleteUserDialogUsername, 
  setCreateAccountDialogEditId,
  setCreateAccountDialogPermissionsSelect,
  setCreateAccountDialogNameTextfield }) {

  const { t } = useTranslation();
  const classes = useStyles();

  const getAllAccounts = useCallback(() => {
    UserService.getAllAccounts().then(res => {
      if(res==='Access forbidden.') {
        console.log(res)
      }
      else {
        setUserAccountsList(res)
      }
    })
  }, [setUserAccountsList])

  useEffect(() => {
    getAllAccounts()
  }, [getAllAccounts])

  const deleteAcc = (id, username) => {
    setConfirmDeleteUserDialogUsername(username, id)
    setConfirmDeleteUserDialogOpen(true)
  }

  const editAcc = (id, name, permissions) => {
    setCreateAccountDialogEditId(id)
    setCreateAccountDialogNameTextfield(name)
    setCreateAccountDialogPermissionsSelect(permissions)
    setCreateAccountDialogOpen(true, 'edit')
  }

  const checkPermissions = (permissions) => {
    const currentUser = AuthService.getCurrentUser().permissions;
    if(currentUser===7) {
      return true;
    }
    if((permissions === 3 || permissions === 7) && currentUser === 3) {
      return false
    }
    if(permissions === 1 && currentUser>=3) {
      return true
    }
    return true
  }

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">{t('AccountMenu.UserAccounts')}</Typography>
        </Grid>
        {accountsList.length > 0 ?
          <Grid item xs={12}>
            <UniversalTable
              columns={[t('UserAccountsPage.IdColumn'), t('UserAccountsPage.NameColumn'), t('UserAccountsPage.PermissionsColumn'), t('UserAccountsPage.ActionColumn')]}
              rows={accountsList.map(acc => [acc._id, acc.name, acc.permissions===1?'User':acc.permissions===3?'Admin':'SuperAdmin', checkPermissions(acc.permissions)?<div>
                <IconButton onClick={()=>editAcc(acc._id, acc.name, acc.permissions)} className={classes.icons} aria-label="edit">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={()=>deleteAcc(acc._id, acc.name)} className={classes.icons} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </div>:null])}
            />
          </Grid> : null
        }
        <Grid item xs={6} sm={4} md={3} lg={2}>
          <Button
            onClick={() => setCreateAccountDialogOpen(true, 'create')}
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
          >
            {t('UserAccountsPage.CreateUser')}
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    accountsList: state.UserAccountsPageReducer.accountsList,
  }
}

const mapDispatchToProps = {
  setUserAccountsList,
  setCreateAccountDialogOpen,
  setConfirmDeleteUserDialogOpen, 
  setConfirmDeleteUserDialogUsername,
  setCreateAccountDialogEditId,
  setCreateAccountDialogNameTextfield,
  setCreateAccountDialogPermissionsSelect
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAccountsPage);