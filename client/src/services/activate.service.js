//activate/deactivate device
const API_URL = "/api/activate/";

class ActivateService {
  async activateDevice(activate, device) {
    const response = await fetch(`${API_URL}/${device}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem("user")).accessToken
      },
      body: JSON.stringify({ isActive: activate })
    })
    if(response.status === 200) {
      const deviceData = await response.json()
      return {
        status: response.status,
        data: deviceData
      }
    }
    else {
      return { status: response.status }
    }
  }
}

export default new ActivateService();