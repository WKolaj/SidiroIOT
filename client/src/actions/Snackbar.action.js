export const SET_SNACKBAR_TEXT = 'SET_SNACKBAR_TEXT';
export const SET_SNACKBAR_SHOWN = 'SET_SNACKBAR_SHOWN';

export const setSnackbarText = (text, severity) => ({ type: SET_SNACKBAR_TEXT, text: text, severity: severity})
export const setSnackbarShown = (shown) => ({ type: SET_SNACKBAR_SHOWN, shown: shown})