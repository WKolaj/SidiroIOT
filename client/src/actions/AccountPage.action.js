export const SET_ACCOUNT_FORM_CURRENT_PASSWORD = 'SET_ACCOUNT_FORM_CURRENT_PASSWORD';
export const SET_ACCOUNT_FORM_NEW_PASSWORD = 'SET_ACCOUNT_FORM_NEW_PASSWORD';
export const SET_ACCOUNT_FORM_REPEATED_NEW_PASSWORD = 'SET_ACCOUNT_FORM_REPEATED_NEW_PASSWORD';

export const setAccountFormCurrentPassword = (password) => ({ type: SET_ACCOUNT_FORM_CURRENT_PASSWORD, currentPassword: password })
export const setAccountFormNewPassword = (password) => ({ type: SET_ACCOUNT_FORM_NEW_PASSWORD, newPassword: password })
export const setAccountFormRepeatedNewPassword = (password) => ({ type: SET_ACCOUNT_FORM_REPEATED_NEW_PASSWORD, repeatedNewPassword: password })