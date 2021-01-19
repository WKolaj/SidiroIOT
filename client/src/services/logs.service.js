const API_URL = "/api/log/";

class LogsService {
  async getLogs() {
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem("user")).accessToken
      }
    })
    if (response.status === 200) {
      const logs = await response.text()
      return {
        status: response.status,
        data: logs
      }
    }
    else {
      return { status: response.status }
    }
  }
}

export default new LogsService();