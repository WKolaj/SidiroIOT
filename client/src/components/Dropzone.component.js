import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import FileService from '../services/file.service';
import { setSnackbarText, setSnackbarShown } from '../actions/Snackbar.action';
import { connect } from 'react-redux';
import { setConfigFile } from '../actions/Settings.action';

const useStyles = makeStyles((theme) => ({
  dropzoneText: {
    color: 'rgb(140 140 140)'
  },
}));

function Dropzone({ setSnackbarText, setSnackbarShown, setConfigFile }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    setConfigFile(acceptedFiles[0])
    // FileService.uploadConfigFile(acceptedFiles[0]).then(res => {
    //   if (res.status === 200) {
    //     setSnackbarText(t('Snackbar.SuccessfulFileUpload'), 'success')
    //     setSnackbarShown(true)
    //   }
    //   else if (res.status === 403) {
    //     setSnackbarText(t('Snackbar.UnsuccessfulFileUpload403'), 'error')
    //     setSnackbarShown(true)
    //   }
    //   else if (res.status === 400) {
    //     setSnackbarText(t('Snackbar.UnsuccessfulFileUpload400'), 'error')
    //     setSnackbarShown(true)
    //   }
    //   else {
    //     setSnackbarText(t('Snackbar.UnknownError'), 'error')
    //     setSnackbarShown(true)
    //   }
    // })
  }, [setSnackbarShown, setSnackbarText, t])
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop, accept: 'application/JSON' });


  const style = useMemo(() => {
    const baseStyle = {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px',
      borderWidth: 2,
      borderRadius: 2,
      borderColor: 'rgb(187 187 187)',
      borderStyle: 'dashed',
      backgroundColor: 'rgb(255 255 255)',
      outline: 'none',
      transition: 'border .5s ease-in-out'
    };

    const activeStyle = {
      borderColor: '#2196f3'
    };

    const acceptStyle = {
      borderColor: '#00e676'
    };

    const rejectStyle = {
      borderColor: '#ff1744'
    };

    return {
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }

  }, [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  return (
    <section className="container">
      <div {...getRootProps({ style })} className="dropzone">
        <input {...getInputProps()} />
        <Typography variant="body1" className={classes.dropzoneText}>{t('SettingsPage.DropzoneText')}</Typography>
      </div>
    </section>
  );
}

const mapDispatchToProps = {
  setSnackbarText,
  setSnackbarShown,
  setConfigFile
}

export default connect(null, mapDispatchToProps)(Dropzone);