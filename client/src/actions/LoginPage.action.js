export const SET_FORM_USERNAME = 'SET_FORM_USERNAME';
export const SET_FORM_PASSWORD = 'SET_FORM_PASSWORD';
export const SET_FORM_USERNAME_ERROR = 'SET_FORM_USERNAME_ERROR';
export const SET_FORM_PASSWORD_ERROR = 'SET_FORM_PASSWORD_ERROR';

export const setFormUsername = (username) => ({ type: SET_FORM_USERNAME, username: username })
export const setFormPassword = (password) => ({ type: SET_FORM_PASSWORD, password: password })
export const setFormUsernameError = (error) => ({ type: SET_FORM_USERNAME_ERROR, error: error })
export const setFormPasswordError = (error) => ({ type: SET_FORM_PASSWORD_ERROR, error: error })