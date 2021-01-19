const API_URL = '/api/user';

class UserService {
  async getMyAccountDetails() {
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem("user")).accessToken
      },
    })
    if (response.status === 200) {
      const userData = await response.json()
      return {
        status: response.status,
        data: userData
      }
    }
    else {
      return { status: response.status }
    }
  }

  async getAllAccounts() {
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem("user")).accessToken
      },
    })
    if (response.status === 200) {
      const userData = await response.json()
      return {
        status: response.status,
        data: userData
      };
    }
    else {
      return { status: response.status }
    }
  }

  async deleteAccount(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem("user")).accessToken
      },
    })
    return { status: response.status }
  }

  async editAccount(id, name, permissions, newPassword = false) {
    let body = {
      name: name,
      permissions: permissions
    };
    let bodyWithPasswords;
    if (newPassword) {
      bodyWithPasswords = {
        ...body,
        password: newPassword,
      }
    }
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem("user")).accessToken
      },
      body: JSON.stringify(newPassword ? bodyWithPasswords : body)
    })
    return { status: response.status }
  }

  async editMyPassword(name, permissions, oldPassword, newPassword) {
    const response = await fetch(`${API_URL}/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem("user")).accessToken
      },
      body: JSON.stringify({ name: name, permissions: permissions, oldPassword: oldPassword, password: newPassword })
    })
    return { status: response.status }
  }

  async register(username, password, permissions) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem("user")).accessToken
      },
      body: JSON.stringify({ name: username, permissions: permissions, password: password })
    })
    return { status: response.status }
  }
}

export default new UserService();