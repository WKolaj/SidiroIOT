import {
  SET_CREATE_ACCOUNT_DIALOG_OPEN,
  SET_CREATE_ACCOUNT_DIALOG_NAME_TEXTFIELD,
  SET_CREATE_ACCOUNT_DIALOG_PASSWORD_TEXTFIELD,
  SET_CREATE_ACCOUNT_DIALOG_PERMISSIONS_SELECT,
  SET_CREATE_ACCOUNT_DIALOG_NAME_TEXTFIELD_ERROR,
  SET_CREATE_ACCOUNT_DIALOG_PASSWORD_TEXTFIELD_ERROR,
  SET_CREATE_ACCOUNT_DIALOG_NEWPASSWORD_TEXTFIELD,
  SET_CREATE_ACCOUNT_DIALOG_EDIT_ID
} from '../actions/CreateAccountDialog.action';

const initialState = {
  open: false,
  type: 'create',
  //form values
  name: '',
  nameError: false,
  password: '',
  passwordError: false,
  newPassword: '',
  editAccountId: '',
  permissions: 1
}

export const CreateAccountDialog = (state = initialState, action) => {
  switch (action.type) {
    case SET_CREATE_ACCOUNT_DIALOG_OPEN:
      return {
        ...state,
        open: action.open,
        type: action.dialogType
      }
    case SET_CREATE_ACCOUNT_DIALOG_NAME_TEXTFIELD:
      return {
        ...state,
        name: action.name
      }
    case SET_CREATE_ACCOUNT_DIALOG_PASSWORD_TEXTFIELD:
      return {
        ...state,
        password: action.password
      }
    case SET_CREATE_ACCOUNT_DIALOG_PERMISSIONS_SELECT:
      return {
        ...state,
        permissions: action.permissions
      }
    case SET_CREATE_ACCOUNT_DIALOG_NAME_TEXTFIELD_ERROR:
      return {
        ...state,
        nameError: action.error
      }
    case SET_CREATE_ACCOUNT_DIALOG_PASSWORD_TEXTFIELD_ERROR:
      return {
        ...state,
        passwordError: action.error
      }
    case SET_CREATE_ACCOUNT_DIALOG_NEWPASSWORD_TEXTFIELD:
      return {
        ...state,
        newPassword: action.newpassword
      }
    case SET_CREATE_ACCOUNT_DIALOG_EDIT_ID:
      return {
        ...state,
        editAccountId: action.id
      }
    default:
      return state
  }
}