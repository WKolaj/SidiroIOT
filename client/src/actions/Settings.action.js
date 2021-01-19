export const SET_CONFIG_FILE = 'SET_CONFIG_FILE';
export const SET_IP_CONFIGURATION = 'SET_IP_CONFIGURATION';

export const setConfigFile = (file) => ({ type: SET_CONFIG_FILE, file: file })
export const setIPConfiguration = (ipconfig) => ({ type: SET_IP_CONFIGURATION, ipconfig: ipconfig })