const API_URL = "/api/configFile/";

class FileService {
  async uploadConfigFile(file) {
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

  async downloadConfigFile() {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-auth-token': JSON.parse(localStorage.getItem("user")).accessToken,
      }
    })
    if (response.status === 200) {
      const configFile = await response.json()
      return {
        status: response.status,
        data: configFile
      }
    }
    else {
      return { status: response.status }
    }
  }

  saveFileAs(data, fileName) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    var json = JSON.stringify(data),
      blob = new Blob([json], { type: "octet/stream" }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);

  };
}

export default new FileService();