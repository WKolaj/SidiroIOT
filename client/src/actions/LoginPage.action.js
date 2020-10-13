export const SET_FORM_USERNAME = 'SET_FORM_USERNAME';
export const SET_FORM_PASSWORD = 'SET_FORM_PASSWORD';

export const setFormUsername = (username) => ({ type: SET_FORM_USERNAME, username: username })
export const setFormPassword = (password) => ({ type: SET_FORM_PASSWORD, password: password })