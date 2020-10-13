const API_URL = process.env.NODE_ENV === "production" ? "/api/auth/" : "http://localhost:5003/api/auth/";

class AuthService {
  async login(username, password) {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ user: username, password: password })
    });
    if (response.json().data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.json()))
    }
    return response.json().data;
  }

  logout() {
    localStorage.removeItem("user");
  }

  async register(username, password) {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ user: username, password: password })
    })
    return response.json().data;
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();