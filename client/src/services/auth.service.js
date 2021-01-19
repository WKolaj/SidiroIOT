const API_URL = "/api/auth/";

class AuthService {
  async login(username, password) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: username, password: password })
    })

    if (response.status === 200) {
      const userData = await response.json()
      if (response.headers.get('x-auth-token')) {
        localStorage.setItem("user", JSON.stringify({ ...userData, accessToken: response.headers.get('x-auth-token') }))
      }
      return userData;
    }
    throw new Error(response.status)
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();