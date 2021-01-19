import AuthService from "../services/auth.service";

export const isAuthenticated = () => {
  const user = AuthService.getCurrentUser();
  if (user === null || user._id === undefined || user.name === undefined || user.permissions === undefined || user.accessToken === undefined) {
    return false
  }
  return true
}

export const isAdmin = () => {
  const user = AuthService.getCurrentUser();
  if(user!==null && user.permissions>=3) {
    return true
  }
  return false
}