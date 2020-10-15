export const SET_CONFIRM_DELETE_USER_DIALOG_OPEN = 'SET_CONFIRM_DELETE_USER_DIALOG_OPEN';
export const SET_CONFIRM_DELETE_USER_DIALOG_USERNAME = 'SET_CONFIRM_DELETE_USER_DIALOG_USERNAME';

export const setConfirmDeleteUserDialogOpen = (open) => ({ type: SET_CONFIRM_DELETE_USER_DIALOG_OPEN, open: open })
export const setConfirmDeleteUserDialogUsername = (username, id) => ({type: SET_CONFIRM_DELETE_USER_DIALOG_USERNAME, username: username, id: id })