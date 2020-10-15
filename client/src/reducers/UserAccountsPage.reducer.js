import { SET_USER_ACCOUNTS_LIST } from '../actions/UserAccountsPage.action';

const initialState = {
  accountsList: []
}

export const UserAccountsPageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_ACCOUNTS_LIST:
      return {
        ...state,
        accountsList: action.list,
      }
    default:
      return state
  }
}