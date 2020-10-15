async function fetchHwInfo(accessToken) {
  const hw = await fetch('/api/devInfo',{
    headers: {
      "x-auth-token": accessToken
    }
  });
  const response = await hw.json()
  return response;
}


self.addEventListener("message", message => {
  const { data } = message;
  fetchHwInfo(data).then(res=>{
    self.postMessage(res)
  })
});