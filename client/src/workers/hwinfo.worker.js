let interval;

/* eslint-disable */
async function fetchHwInfo(accessToken) {
  const hw = await fetch('/api/devInfo', {
    headers: {
      "x-auth-token": accessToken
    }
  });
  const response = await hw.json()
  return response;
}

self.addEventListener("message", message => {
  const { data } = message;
  if (data.text === 'start') {
    //once instantly
    fetchHwInfo(data.token).then(res => {
      self.postMessage(res)
    })
    //intervally every x seconds
    interval = setInterval(() => {
      fetchHwInfo(data.token).then(res => {
        self.postMessage(res)
      })
    }, 10000)
  }
  else if (data.text === 'stop') {
    clearInterval(interval)
  }
});