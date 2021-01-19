const sortByDeviceName = (obj) => Object.entries(obj).sort((a, b) => a[1].name.localeCompare(b[1].name)).reduce((o, [k, v]) => { o[k] = v; return o }, {})

export const sortByDeviceType = (obj) => {
  let connectableDevices = {}
  let internalDevices = {}
  let agentDevices = {}
  let restDevices = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value.type === 'MBDevice' || value.type === 'MBGatewayDevice' || value.type === 'S7Device') {
      connectableDevices = {
        ...connectableDevices,
        [key]: value
      }
    }
    else if (value.type === 'InternalDevice') {
      internalDevices = {
        ...internalDevices,
        [key]: value
      }
    }
    else if (value.type === 'MSAgentDevice') {
      agentDevices = {
        ...agentDevices,
        [key]: value
      }
    }
    else {
      restDevices = {
        ...restDevices,
        [key]: value
      }
    }
  }
  const sortedConnectableDevices = sortByDeviceName(connectableDevices)
  const sortedInternalDevices = sortByDeviceName(internalDevices)
  const sortedAgentDevices = sortByDeviceName(agentDevices)
  const sortedRestDevices = sortByDeviceName(restDevices)
  return {
    sortedConnectableDevices,
    sortedInternalDevices,
sortedAgentDevices,
sortedRestDevices
  }
}