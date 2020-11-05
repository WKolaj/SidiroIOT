import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DevicesList from './DevicesList.component';
import DeviceSelectionTabs from './UniversalTabs.component';
import { connect } from 'react-redux';
import UniversalTable from './UniversalTable.component';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { mockFetch, MBDevice, S7Device, InternalDevice, MSAgent, calcElement, alert } from '../mock/index.mock';
import { setAllDevices } from '../actions/DevicesSelectionPage.action';
import CollapsibleTable from './CollapsibleTable.component';

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(3)
  },
}));

function DevicesSelectionPage(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { setAllDevices, allDevices, selectedDevice } = props

  useEffect(() => {
    mockFetch([MBDevice(calcElement('AverageCalculator'), alert('HighLimitAlert')),
    S7Device(calcElement('FactorCalculator'), alert('LowLimitAlert')),
    InternalDevice(calcElement('IncreaseCalculator'), alert('BandwidthLimitAlert')),
    MSAgent(calcElement('SumCalculator'), alert('ExactValuesAlert'))]).then(res => {
      setAllDevices(res)
    })
  }, [setAllDevices])

  const createTabs = (devices, selectedDevice) => {
    let columns = []
    let rows = []
    let tabs = []
    devices.map((device, index) => {
      const entries = Object.entries(device)
      for (const [, properties] of entries) {
        if (properties.name === selectedDevice.selectedDeviceName) {
          const propertiesEntries = Object.entries(properties)
          for (const [column, cell] of propertiesEntries) {
            if (typeof cell !== 'object') {
              //INFO tab
              columns.push(t(`DevicesSelectionPage.Properties.${column}`))
              //columns.push(column)
              rows.push(cell)
            }
            else {
              const tab = createTab(cell)
              tabs.push({
                label: t(`DevicesSelectionPage.Tabs.${column}`),
                content: <CollapsibleTable columns={tab.columns} rows={[tab.rows]}/>
              })
            }
          }
        }
      }
      return null
    })
    tabs.push({
      label: t(`DevicesSelectionPage.Tabs.info`),
      content: <CollapsibleTable columns={columns} rows={[rows]} />
    })

    return <DeviceSelectionTabs
      name={selectedDevice.selectedDeviceType}
      tabs={tabs}
    />
  }

  const createTab = (obj) => {
    let columns = []
    let rows = []
    const entries = Object.entries(obj)
    for (const [, properties] of entries) {
      const propertiesEntries = Object.entries(properties)
      for (const [column, cell] of propertiesEntries) {
        columns.push(t(`DevicesSelectionPage.Properties.${column}`))
        rows.push(cell)
      }
    }
    return { rows, columns }
  }

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={3}>
          <Typography variant="h4" className={classes.title}>{t('DevicesSelectionPage.DevicesTitle')}</Typography>
          <DevicesList />
        </Grid>
        <Grid container item xs={12} sm={12} md={9} spacing={0}>
          <Grid item xs={12}>
            <Typography variant="h4" className={classes.title}>{selectedDevice.selectedDeviceName}</Typography>
            <React.Fragment>
              {createTabs(allDevices, selectedDevice)}
            </React.Fragment>
          </Grid>
          <Grid container item xs={12} spacing={1}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h5">{t('DevicesSelectionPage.Status')}: {t('DevicesSelectionPage.StatusConnected')}</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button fullWidth variant="contained" color="primary">{t('DevicesSelectionPage.Connect')}</Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button fullWidth variant="contained" color="secondary">{t('DevicesSelectionPage.Disconnect')}</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    selectedDevice: state.DevicesListReducer,
    allDevices: state.DevicesSelectionPageReducer.devices
  }
}

const mapDispatchToProps = {
  setAllDevices
}

export default connect(mapStateToProps, mapDispatchToProps)(DevicesSelectionPage)