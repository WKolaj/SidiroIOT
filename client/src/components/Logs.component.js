import React, { useEffect, useCallback, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { setLogs } from '../actions/Logs.action';
import LogsService from '../services/logs.service';
import RefreshIcon from '@material-ui/icons/Refresh';
import { makeStyles } from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { setBackdropOpen, setBackdropClosed } from '../actions/Backdrop.action';
import Grow from '@material-ui/core/Grow';
import GetAppIcon from '@material-ui/icons/GetApp';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(3)
  },
  devicesTitleInline: {
    display: 'inline-block'
  },
  alignTop: {
    verticalAlign: 'top'
  },
  linkInAlert: {
    color: 'white',
    textDecoration: 'underline',
    cursor: 'pointer'
  }
}));

function Logs({ logs, setLogs, setBackdropOpen, setBackdropClosed }) {
  const [downloadButtonDisabled, setdownloadButtonDisabled] = useState(false)
  const { t } = useTranslation()
  const classes = useStyles();
  const initialLogsNumber = 250;

  const downloadLogsFile = (filename, text) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const getLogs = useCallback((getAll = false) => {
    setBackdropOpen()
    setdownloadButtonDisabled(true)
    LogsService.getLogs().then(res => {
      setBackdropClosed()
      setdownloadButtonDisabled(false)
      if (res.status === 200) {
        if (getAll) {
          downloadLogsFile('SidiroIOT-logs.log', res.data)
        }
        else {
          const parsedContent = parseLogs(res.data);
          const joinedString = parsedContent.filter((item, i) => i >= parsedContent.length - initialLogsNumber).join("\r\n");
          setLogs(joinedString)
          const textarea = document.getElementById('logs-multiline');
          textarea.scrollTop = textarea.scrollHeight;
        }
      }
    })
  }, [setLogs, setBackdropOpen, setBackdropClosed])

  useEffect(() => {
    getLogs()
    //clear memory on route exit
    return () => {
      setLogs(null)
    }
  }, [getLogs, setLogs])

  /**
 * @description Method for converting log file content to array of strings to display
 * @param {String} logFileContent content of log file
 */
  const parseLogs = (logFileContent) => {
    //Defining array to return
    let logsToReturn = [];
    if (!logFileContent) return logsToReturn;

    //Splitting log file content into lines
    let splitedLogs = logFileContent.split(/\r\n|\r|\n/);

    //For each line - if line is not empty and defined - try parse it to JSON
    //If parsing fails or JSON of log is invalid - append log line itself to logsToReturnArray
    //If parsing is successful and JSON is valid - format the log line and append to logsToReturn array
    for (let logLine of splitedLogs) {
      if (logLine !== undefined && logLine !== null && logLine !== "") {
        try {
          //Throws if JSON is not valid
          let jsonLine = JSON.parse(logLine);
          let timestamp = jsonLine.timestamp;
          let level = jsonLine.level;
          let message = jsonLine.message;

          //Checking if JSON is valid after parsing
          if (
            timestamp !== undefined &&
            level !== undefined &&
            message !== undefined
          ) {
            logsToReturn.push(`${timestamp} [${level}]: ${message}`);
          } else {
            logsToReturn.push(logLine);
          }
        } catch (err) {
          logsToReturn.push(logLine);
        }
      }
    }

    return logsToReturn;
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.devicesTitleInline}>{t('LogsPage.Title')}</Typography>
          <Zoom in={true} style={{ transitionDelay: '500ms' }}>
            <Tooltip title={t('LogsPage.RefreshLastLogs')} placement="bottom">
              <IconButton aria-label="refresh" className={classes.alignTop} onClick={() => getLogs()} >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Zoom>
        </Grid>
        {logs !== null ?
          <React.Fragment>
            <Grid item xs={12}>
              <Typography variant="h6">{t('LogsPage.ShowingLogsSubtitle1')} {initialLogsNumber} {t('LogsPage.ShowingLogsSubtitle2')}</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled
                fullWidth
                id="logs-multiline"
                label={t('LogsPage.DeviceLogsLabel')}
                multiline
                rowsMax={24}
                value={logs}
              />
            </Grid>
            <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={500}>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <Button
                disabled={downloadButtonDisabled}
                  onClick={() => getLogs(true)}
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<GetAppIcon />}
                >
                  {t('LogsPage.DownloadAllLogs')}
                </Button>
              </Grid>
            </Grow>
          </React.Fragment>
          : null
        }
      </Grid>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    logs: state.LogsReducer.logs
  }
}

const mapDispatchToProps = {
  setLogs,
  setBackdropOpen,
  setBackdropClosed
}

export default connect(mapStateToProps, mapDispatchToProps)(Logs);