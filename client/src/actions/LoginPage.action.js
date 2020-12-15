export const SET_LOGIN_FORM_USERNAME = 'SET_LOGIN_FORM_USERNAME';
export const SET_LOGIN_FORM_PASSWORD = 'SET_LOGIN_FORM_PASSWORD';
export const SET_LOGIN_FORM_USERNAME_ERROR = 'SET_LOGIN_FORM_USERNAME_ERROR';
export const SET_LOGIN_FORM_PASSWORD_ERROR = 'SET_LOGIN_FORM_PASSWORD_ERROR';

export const setLoginFormUsername = (username) => ({ type: SET_LOGIN_FORM_USERNAME, username: username })
export const setLoginFormPassword = (password) => ({ type: SET_LOGIN_FORM_PASSWORD, password: password })
export const setLoginFormUsernameError = (error) => ({ type: SET_LOGIN_FORM_USERNAME_ERROR, error: error })
export const setLoginFormPasswordError = (error) => ({ type: SET_LOGIN_FORM_PASSWORD_ERROR, error: error })