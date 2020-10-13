export const SET_ACCOUNT_FORM_CURRENT_PASSWORD = 'SET_ACCOUNT_FORM_CURRENT_PASSWORD';
export const SET_ACCOUNT_FORM_NEW_PASSWORD = 'SET_ACCOUNT_FORM_NEW_PASSWORD';

export const setAccountFormCurrentPassword = (password) => ({ type: SET_ACCOUNT_FORM_CURRENT_PASSWORD, password: password })
export const setAccountFormNewPassword = (password) => ({ type: SET_ACCOUNT_FORM_NEW_PASSWORD, password: password })