export const SET_CREATE_ACCOUNT_DIALOG_OPEN = 'SET_CREATE_ACCOUNT_DIALOG_OPEN';
export const SET_CREATE_ACCOUNT_DIALOG_NAME_TEXTFIELD = 'SET_CREATE_ACCOUNT_DIALOG_NAME_TEXTFIELD';
export const SET_CREATE_ACCOUNT_DIALOG_NAME_TEXTFIELD_ERROR = 'SET_CREATE_ACCOUNT_DIALOG_NAME_TEXTFIELD_ERROR';
export const SET_CREATE_ACCOUNT_DIALOG_PASSWORD_TEXTFIELD = 'SET_CREATE_ACCOUNT_DIALOG_PASSWORD_TEXTFIELD';
export const SET_CREATE_ACCOUNT_DIALOG_PASSWORD_TEXTFIELD_ERROR = 'SET_CREATE_ACCOUNT_DIALOG_PASSWORD_TEXTFIELD_ERROR';
export const SET_CREATE_ACCOUNT_DIALOG_PERMISSIONS_SELECT = 'SET_CREATE_ACCOUNT_DIALOG_PERMISSIONS_SELECT';
export const SET_CREATE_ACCOUNT_DIALOG_NEWPASSWORD_TEXTFIELD = 'SET_CREATE_ACCOUNT_DIALOG_NEWPASSWORD_TEXTFIELD';
export const SET_CREATE_ACCOUNT_DIALOG_EDIT_ID = 'SET_CREATE_ACCOUNT_DIALOG_EDIT_ID';

export const setCreateAccountDialogOpen = (open, dialogType) => ({ type: SET_CREATE_ACCOUNT_DIALOG_OPEN, open: open, dialogType: dialogType }) //dialogType === create or edit
export const setCreateAccountDialogNameTextfield = (name) => ({ type: SET_CREATE_ACCOUNT_DIALOG_NAME_TEXTFIELD, name: name })
export const setCreateAccountDialogPasswordTextfield = (password) => ({ type: SET_CREATE_ACCOUNT_DIALOG_PASSWORD_TEXTFIELD, password: password })
export const setCreateAccountDialogPermissionsSelect = (permissions) => ({ type: SET_CREATE_ACCOUNT_DIALOG_PERMISSIONS_SELECT, permissions: permissions })
export const setCreateAccountDialogNameTextfieldError = (error) => ({ type: SET_CREATE_ACCOUNT_DIALOG_NAME_TEXTFIELD_ERROR, error: error })
export const setCreateAccountDialogPasswordTextfieldError = (error) => ({ type: SET_CREATE_ACCOUNT_DIALOG_PASSWORD_TEXTFIELD_ERROR, error: error })
export const setCreateAccountDialogNewpasswordTextfield = (newpassword) => ({ type: SET_CREATE_ACCOUNT_DIALOG_NEWPASSWORD_TEXTFIELD, newpassword: newpassword })
export const setCreateAccountDialogEditId = (id) => ({ type: SET_CREATE_ACCOUNT_DIALOG_EDIT_ID, id: id })