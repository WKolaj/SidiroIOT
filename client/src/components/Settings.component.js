import React, { useEffect } from 'react';
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
import { setConfigFile, setIPConfiguration } from '../actions/Settings.action';
import { setBackdropOpen, setBackdropClosed } from '../actions/Backdrop.action';
import IPConfigService from '../services/ipconfig.service';
import Card from '../components/Card.component';
import { setIpConfigDialogOpen } from '../actions/IPconfigDialog.action';
import Grow from '@material-ui/core/Grow';

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  strong: {
    fontWeight: 700
  },
  subTitle: {
    marginTop: theme.spacing(3)
  }
}));

function Settings({ setSnackbarText, setSnackbarShown, file, setConfigFile, setBackdropOpen, setBackdropClosed, setIPConfiguration, ipconfig, setIpConfigDialogOpen }) {
  const classes = useStyles();
  const { t } = useTranslation()

  useEffect(() => {
    IPConfigService.getIpConfig().then(res => {
      if (res.status === 200) {
        setIPConfiguration(res.data)
      }
    })
  }, [setIPConfiguration])

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
    setBackdropOpen()
    FileService.uploadConfigFile(file).then(res => {
      setBackdropClosed()
      //reset file after upload try
      setConfigFile(null)

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
  }

  const renderNetworkInterfaces = () => {
    return Object.entries(ipconfig).map((networkInterface, index) => {
      networkInterface = networkInterface[1]
      return <Grow key={networkInterface.name} in={true} style={{ transformOrigin: '0 0 0' }} timeout={(index+1)*500}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card
            title={networkInterface.name}
            body={<React.Fragment>
              {networkInterface.dhcp !== undefined ? <Typography variant="body2" color="textSecondary" component="p">DHCP: {networkInterface.dhcp === true ? t('SettingsPage.DHCPTrue') : t('SettingsPage.DHCPFalse')}</Typography> : null}
              {networkInterface.ipAddress !== undefined ? <Typography variant="body2" color="textSecondary" component="p">{t('SettingsPage.IPAddress')}: {networkInterface.ipAddress}</Typography> : null}
              {networkInterface.subnetMask !== undefined ? <Typography variant="body2" color="textSecondary" component="p">{t('SettingsPage.SubnetMask')}: {networkInterface.subnetMask}</Typography> : null}
              {networkInterface.gateway !== undefined ? <Typography variant="body2" color="textSecondary" component="p">{t('SettingsPage.Gateway')}: {networkInterface.gateway}</Typography> : null}
              {networkInterface.dns !== undefined && networkInterface.dns[0] !== undefined ? <Typography variant="body2" color="textSecondary" component="p">{t('IPConfigDialog.DNSPrimary')}: {networkInterface.dns[0]}</Typography> : null}
              {networkInterface.dns !== undefined && networkInterface.dns[1] !== undefined ? <Typography variant="body2" color="textSecondary" component="p">{t('IPConfigDialog.DNSSecondary')}: {networkInterface.dns[1]}</Typography> : null}
            </React.Fragment>}
            buttonText={t('SettingsPage.Edit')}
            buttonAction={() => setIpConfigDialogOpen(true, networkInterface.name)} />
        </Grid>
      </Grow>
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
                    <td>{(file.size/1024).toFixed(2)} kB</td>
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
            <Grid item xs={12}>
              <Divider className={classes.divider} />
            </Grid>

          </React.Fragment>
          : null}

        <Grid item xs={6} sm={6} md={4} lg={2}>
          <Button
            onClick={() => getConfigFile()}
            fullWidth variant="contained" color="primary">{t('SettingsPage.LoadButton')}</Button>
        </Grid>
        {ipconfig !== null && ipconfig !== {} ?
          <React.Fragment>
            <Grid item xs={12} className={classes.subTitle}>
              <Typography variant="h4">{t('SettingsPage.IPConfigTitle')}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">{t('SettingsPage.NetworkInterfaces')}</Typography>
            </Grid>
            {renderNetworkInterfaces()}
          </React.Fragment>
          : null}
      </Grid>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    file: state.SettingsReducer.file,
    ipconfig: state.SettingsReducer.ipconfig
  }
}

const mapDispatchToProps = {
  setSnackbarText,
  setSnackbarShown,
  setConfigFile,
  setBackdropOpen,
  setBackdropClosed,
  setIPConfiguration,
  setIpConfigDialogOpen
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);