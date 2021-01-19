import { SET_AUTHENTICATED } from '../actions/Authentication.action';

const initialState = {
  authed: false,
}

export const AuthenticationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authed: action.authenticated,
      }
    default:
      return state
  }
}