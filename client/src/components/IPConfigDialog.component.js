import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  setSnackbarText,
  setSnackbarShown
} from '../actions/Snackbar.action';
import {
  setBackdropOpen,
  setBackdropClosed
} from '../actions/Backdrop.action';
import { connect } from 'react-redux';
import {
  setIpConfigDialogOpen,
  setIpConfigDialogIpAddress,
  setIpConfigDialogSubnetMask,
  setIpConfigDialogGateway,
  setIpConfigDialogDHCP,
  setIpConfigDialogDNSPrimary,
  setIpConfigDialogDNSSecondary
} from '../actions/IPconfigDialog.action';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IPConfigService from '../services/ipconfig.service';
import { setIPConfiguration } from '../actions/Settings.action';

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%'
  },
  form: {
    '& > *': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
  },
  visible: {
    display: 'inline-flex'
  },
  invisible: {
    display: 'none'
  },
  disconnectionWarning: {
    color: 'red'
  }
})
)

function IPConfigDialog({ open,
  ipAddress,
  subnetMask,
  gateway,
  name,
  dhcp,
  dnsPrimary,
  dnsSecondary,
  ipConfig,
  setIpConfigDialogOpen,
  setIpConfigDialogIpAddress,
  setIpConfigDialogSubnetMask,
  setIpConfigDialogGateway,
  setIpConfigDialogDHCP,
  setIpConfigDialogDNSPrimary,
  setIpConfigDialogDNSSecondary,
  setBackdropOpen,
  setBackdropClosed,
  setSnackbarText,
  setSnackbarShown,
  setIPConfiguration
}) {

  useEffect(() => {
    if (ipConfig[name] !== undefined) {
      setIpConfigDialogIpAddress(ipConfig[name].ipAddress !== undefined ? ipConfig[name].ipAddress : '')
      setIpConfigDialogSubnetMask(ipConfig[name].subnetMask !== undefined ? ipConfig[name].subnetMask : '')
      setIpConfigDialogGateway(ipConfig[name].gateway !== undefined ? ipConfig[name].gateway : '')
      setIpConfigDialogDHCP(ipConfig[name].dhcp !== undefined ? ipConfig[name].dhcp : false)
      setIpConfigDialogDNSPrimary(ipConfig[name].dns !== undefined && ipConfig[name].dns[0] !== undefined ? ipConfig[name].dns[0] : '')
      setIpConfigDialogDNSSecondary(ipConfig[name].dns !== undefined && ipConfig[name].dns[1] !== undefined ? ipConfig[name].dns[1] : '')
    }
  }, [open, setIpConfigDialogIpAddress, setIpConfigDialogSubnetMask, setIpConfigDialogGateway, setIpConfigDialogDHCP, setIpConfigDialogDNSPrimary, setIpConfigDialogDNSSecondary, ipConfig, name])
  const classes = useStyles();
  const { t } = useTranslation()

  const handleChange = (event) => {
    const val = event.target.value;
    const name = event.target.name;

    switch (name) {
      case 'ip-address':
        setIpConfigDialogIpAddress(val)
        break;
      case 'subnet-mask':
        setIpConfigDialogSubnetMask(val)
        break;
      case 'gateway':
        setIpConfigDialogGateway(val)
        break;
      case 'dhcp':
        setIpConfigDialogDHCP(event.target.checked)
        break;
      case 'dns-primary':
        setIpConfigDialogDNSPrimary(val)
        break;
      case 'dns-secondary':
        setIpConfigDialogDNSSecondary(val)
        break;
      default:
        break;
    }
  }


  const apiWithTimeout = (httpReq, milliseconds) => {
    setIpConfigDialogOpen(false)
    setBackdropOpen()
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject(new Error("Data fetch failed in " + milliseconds + " ms"))
      }, milliseconds)
      httpReq.then(res => { resolve(res) }, err => { reject(err) })
    })
  };

  const setIpConfig = () => {
    let config = {
      name: name,
      dhcp: dhcp,
      dns: []
    }
    if (dnsPrimary !== '') {
      config = {
        ...config,
        dns: [...config.dns, dnsPrimary]
      }
    }
    if (dnsSecondary !== '') {
      config = {
        ...config,
        dns: [...config.dns, dnsSecondary]
      }
    }

    if (dhcp === false) {
      config = {
        ...config,
        ipAddress: ipAddress,
        subnetMask: subnetMask,
        gateway: gateway
      }
    }

    apiWithTimeout(IPConfigService.setIpConfig(name, config), 10000).then(res => {
      IPConfigService.getIpConfig().then(res => {
        if (res.status === 200) {
          setIPConfiguration(res.data)
        }
      })
      setBackdropClosed()
      if (res.status === 200) {
        setSnackbarText(t('Snackbar.SuccessfulIPConfig'), 'success')
        setSnackbarShown(true)
      }
      else if (res.status === 400) {
        setSnackbarText(t('Snackbar.UnsuccessfulIPConfig'), 'error')
        setSnackbarShown(true)
      }
      else {
        setSnackbarText(t('Snackbar.UnknownError'), 'error')
        setSnackbarShown(true)
      }
    }).catch(() => {
      //if changing interface you're connected to
      if (ipConfig[name].ipAddress === window.location.hostname) {
        if (dhcp !== true) {
          window.location.href = window.location.port !== "" ? `http://${ipAddress}:${window.location.port}` : `http://${ipAddress}`
        }
        else {
          window.location.reload()
        }
      }
      else {
        window.location.reload()
      }
    });
  }

  return (
    <div>
      <Dialog open={open} onClose={() => setIpConfigDialogOpen(false)} aria-labelledby="form-dialog-title" >
        <DialogTitle id="form-dialog-title">{t('IPConfigDialog.ChangeConfiguration')}</DialogTitle>
        <DialogContent>
          {ipConfig[name] !== undefined && ipConfig[name].ipAddress !== undefined && ipConfig[name].ipAddress === window.location.hostname ?
            <DialogContentText className={classes.disconnectionWarning}>
              {dhcp === false ? t('IPConfigDialog.DisconnectionWarningDhcpFalse') : t('IPConfigDialog.DisconnectionWarningDhcpTrue')}
            </DialogContentText>
            : null}
          <DialogContentText>
            {`${t('IPConfigDialog.CurrentHostnameText')}: ${window.location.origin}`}
          </DialogContentText>
          <form className={classes.form}>
            <div>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox checked={dhcp} onChange={handleChange} name="dhcp" />}
                  label="DHCP"
                />
              </FormGroup>
              <TextField
                className={dhcp ? classes.invisible : classes.visible}
                autoFocus
                value={ipAddress}
                margin="dense"
                id="ip-address"
                name="ip-address"
                label={t('SettingsPage.IPAddress')}
                type="text"
                onChange={handleChange}
                fullWidth
              />
              <TextField
                className={dhcp ? classes.invisible : classes.visible}
                value={subnetMask}
                margin="dense"
                id="subnet-mask"
                name="subnet-mask"
                label={t('SettingsPage.SubnetMask')}
                type="text"
                onChange={handleChange}
                fullWidth
              />
              <TextField
                className={dhcp ? classes.invisible : classes.visible}
                value={gateway}
                margin="dense"
                id="gateway"
                name="gateway"
                label={t('SettingsPage.Gateway')}
                type="text"
                onChange={handleChange}
                fullWidth
              />
              <TextField
                className={dhcp ? classes.invisible : classes.visible}
                value={dnsPrimary}
                margin="dense"
                id="dns-primary"
                name="dns-primary"
                label={t('IPConfigDialog.DNSPrimary')}
                type="text"
                onChange={handleChange}
                fullWidth
              />
              <TextField
                className={dhcp ? classes.invisible : classes.visible}
                value={dnsSecondary}
                margin="dense"
                id="dns-secondary"
                name="dns-secondary"
                label={t('IPConfigDialog.DNSSecondary')}
                type="text"
                onChange={handleChange}
                fullWidth
              />

            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIpConfigDialogOpen(false)} color="primary">
            {t('IPConfigDialog.CancelButton')}
          </Button>
          <Button onClick={() => setIpConfig()} color="primary">
            {t('IPConfigDialog.ConfirmButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    open: state.IPConfigReducer.open,
    name: state.IPConfigReducer.name,
    ipAddress: state.IPConfigReducer.ipAddress,
    subnetMask: state.IPConfigReducer.subnetMask,
    gateway: state.IPConfigReducer.gateway,
    dhcp: state.IPConfigReducer.dhcp,
    dnsPrimary: state.IPConfigReducer.dnsPrimary,
    dnsSecondary: state.IPConfigReducer.dnsSecondary,
    ipConfig: state.SettingsReducer.ipconfig
  }
}

const mapDispatchToProps = {
  setSnackbarText,
  setSnackbarShown,
  setBackdropOpen,
  setBackdropClosed,
  setIpConfigDialogOpen,
  setIpConfigDialogIpAddress,
  setIpConfigDialogSubnetMask,
  setIpConfigDialogGateway,
  setIpConfigDialogDHCP,
  setIpConfigDialogDNSPrimary,
  setIpConfigDialogDNSSecondary,
  setIPConfiguration
}

export default connect(mapStateToProps, mapDispatchToProps)(IPConfigDialog);