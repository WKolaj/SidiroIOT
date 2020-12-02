import React from 'react';
import Grid from '@material-ui/core/Grid';
import Dropzone from './Dropzone.component';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import FileService from '../services/file.service';
import { setSnackbarText, setSnackbarShown } from '../actions/Snackbar.action';
import { connect } from 'react-redux';

function Settings({ setSnackbarText, setSnackbarShown }) {
  const { t } = useTranslation()

  const getConfigFile = () => {
    FileService.downloadConfigFile().then(res => {
      if (res.status === 200) {
        FileService.saveFileAs(res.data, 'projectSettings.json')
      }
      else if (res.status === 403) {
        setSnackbarText(t('Snackbar.Generic403'), 'error')
        setSnackbarShown(true)
      }
      else {
        setSnackbarText(t('Snackbar.UnknownError'), 'error')
        setSnackbarShown(true)
      }
    })
  }

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">{t('SettingsPage.Title')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Dropzone />
        </Grid>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Button
            onClick={() => getConfigFile()}
            fullWidth variant="contained" color="primary">{t('SettingsPage.LoadButton')}</Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const mapDispatchToProps = {
  setSnackbarText,
  setSnackbarShown
}

export default connect(null, mapDispatchToProps)(Settings);