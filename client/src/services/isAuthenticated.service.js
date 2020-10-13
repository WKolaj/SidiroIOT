import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

export const isAuthenticated = (role) => {
  console.log(role)
  if (AuthService.getCurrentUser() === null || AuthService.getCurrentUser().roles.indexOf(role) === -1) {
    return false
  }
  else {
    if (role === 'ROLE_USERS4') {
      UserService.getS4Data().catch(err => {
        return false
      })
    }
    else if (role === 'ROLE_USERS8') {
      UserService.getS8Data().catch(err => {
        return false
      })
    }
    else {
      return false
    }
  }
  return true
}