let interval;

/* eslint-disable */
async function fetchDevice(accessToken, device) {
  const devices = await fetch(`/api/device/${device}`, {
    headers: {
      "x-auth-token": accessToken
    }
  });
  const response = await devices.json()
  return response;
}

self.addEventListener("message", message => {
  const { data } = message;
  if (data.text === 'start') {
    clearInterval(interval)
    //once after 5 seconds
    setTimeout(()=>{
      fetchDevice(data.token, data.device).then(res => {
        self.postMessage(res)
      })
    },5000)
    
    //intervally every x seconds
    interval = setInterval(() => {
      fetchDevice(data.token, data.device).then(res => {
        self.postMessage(res)
      })
    }, 10000)
  }
  else if (data.text === 'stop') {
    clearInterval(interval)
  }
});