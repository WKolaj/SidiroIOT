const API_URL = "/api/ipConfig/";

class IPConfigService {
  async getIpConfig() {
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem("user")).accessToken
      }
    })
    if (response.status === 200) {
      const ipConfig = await response.json()
      return {
        status: response.status,
        data: ipConfig
      }
    }
    else {
      return { status: response.status }
    }
  }
  async setIpConfig(networkInterface, config) {

    const response = await fetch(`${API_URL}/${networkInterface}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem("user")).accessToken
      },
      body: JSON.stringify(config)
    })
    if (response.status === 200) {
      const ipConfig = await response.json()
      return {
        status: response.status,
        data: ipConfig
      }
    }
    else {
      return { status: response.status }
    }
  }
}

export default new IPConfigService();