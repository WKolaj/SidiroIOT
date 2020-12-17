import { SET_BACKDROP_OPEN, SET_BACKDROP_CLOSED } from '../actions/Backdrop.action';

const initialState = {
  open: false,
}

export const BackdropReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BACKDROP_OPEN:
      return {
        ...state,
        open: true
      }
    case SET_BACKDROP_CLOSED:
      return {
        ...state,
        open: false
      }
    default:
      return state
  }
}