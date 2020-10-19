const API_URL = "/api/configFile/";

class FileService {
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem("user")).accessToken,
      },
      body: formData
    })
    return { status: response.status }
  }
}

export default new FileService();