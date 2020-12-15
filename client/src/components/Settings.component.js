import React from 'react';
import Grid from '@material-ui/core/Grid';
import Dropzone from './Dropzone.component';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import FileService from '../services/file.service';
import { setSnackbarText, setSnackbarShown } from '../actions/Snackbar.action';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { setConfigFile } from '../actions/Settings.action';

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  strong: {
    fontWeight: 700
  }
}));

function Settings({ setSnackbarText, setSnackbarShown, file, setConfigFile }) {
  const classes = useStyles();
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

  const uploadFile = () => {
    FileService.uploadConfigFile(file).then(res => {
      if (res.status === 200) {
        setSnackbarText(t('Snackbar.SuccessfulFileUpload'), 'success')
        setSnackbarShown(true)
      }
      else if (res.status === 403) {
        setSnackbarText(t('Snackbar.UnsuccessfulFileUpload403'), 'error')
        setSnackbarShown(true)
      }
      else if (res.status === 400) {
        setSnackbarText(t('Snackbar.UnsuccessfulFileUpload400'), 'error')
        setSnackbarShown(true)
      }
      else {
        setSnackbarText(t('Snackbar.UnknownError'), 'error')
        setSnackbarShown(true)
      }
    })
    //reset file after upload try
    setConfigFile(null)
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
        {file !== null ?
          <React.Fragment>
            <Grid item xs={12}>
              <table>
                <tbody>
                  <tr>
                    <td>{t('SettingsPage.FileName')}&emsp;</td>
                    <td>{file.name}</td>
                  </tr>
                  <tr>
                    <td>{t('SettingsPage.FileSize')}&emsp;</td>
                    <td>{file.size} B</td>
                  </tr>
                </tbody>
              </table>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Button
                fullWidth
                onClick={() => uploadFile()}
                variant="outlined" color="secondary">{t('SettingsPage.UploadFile')}</Button>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Button
                fullWidth
                onClick={() => setConfigFile(null)}
                variant="outlined" color="primary">{t('SettingsPage.RemoveFile')}</Button>
            </Grid>
          </React.Fragment>
          : null}
      </Grid>
      {file !== null ? <Divider className={classes.divider} /> : null}
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Button
            onClick={() => getConfigFile()}
            fullWidth variant="contained" color="primary">{t('SettingsPage.LoadButton')}</Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    file: state.SettingsReducer.file,
  }
}

const mapDispatchToProps = {
  setSnackbarText,
  setSnackbarShown,
  setConfigFile
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);