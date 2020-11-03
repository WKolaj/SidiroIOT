const API_URL = "/api/device/";

class DeviceService {
  // async getDevices() {
  //   const response = await fetch(`${API_URL}`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'x-auth-token': JSON.parse(localStorage.getItem("user")).accessToken
  //     }
  //   })
  //   if(response.status === 200) {
  //     const deviceData = await response.json()
  //     return {
  //       status: response.status,
  //       data: deviceData
  //     }
  //   }
  //   else {
  //     return { status: response.status }
  //   }
  // }
}

export default new DeviceService();