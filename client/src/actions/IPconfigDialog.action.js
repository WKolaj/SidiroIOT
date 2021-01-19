export const SET_IP_CONFIG_DIALOG_OPEN = 'SET_IP_CONFIG_DIALOG_OPEN';
export const SET_IP_CONFIG_DIALOG_IP_ADDRESS = 'SET_IP_CONFIG_DIALOG_IP_ADDRESS';
export const SET_IP_CONFIG_DIALOG_SUBNET_MASK = 'SET_IP_CONFIG_DIALOG_SUBNET_MASK';
export const SET_IP_CONFIG_DIALOG_GATEWAY = 'SET_IP_CONFIG_DIALOG_GATEWAY';
export const SET_IP_CONFIG_DIALOG_DHCP = 'SET_IP_CONFIG_DIALOG_DHCP';
export const SET_IP_CONFIG_DIALOG_DNS_PRIMARY = 'SET_IP_CONFIG_DIALOG_DNS_PRIMARY';
export const SET_IP_CONFIG_DIALOG_DNS_SECONDARY = 'SET_IP_CONFIG_DIALOG_DNS_SECONDARY';

export const setIpConfigDialogOpen = (open, interfaceName = false) => ({ type: SET_IP_CONFIG_DIALOG_OPEN, open, interfaceName })
export const setIpConfigDialogIpAddress = (ipAddress) => ({ type: SET_IP_CONFIG_DIALOG_IP_ADDRESS, ipAddress })
export const setIpConfigDialogSubnetMask = (subnetMask) => ({ type: SET_IP_CONFIG_DIALOG_SUBNET_MASK, subnetMask })
export const setIpConfigDialogGateway = (gateway) => ({ type: SET_IP_CONFIG_DIALOG_GATEWAY, gateway })
export const setIpConfigDialogDHCP = (dhcp) => ({ type: SET_IP_CONFIG_DIALOG_DHCP, dhcp })
export const setIpConfigDialogDNSPrimary = (dnsPrimary) => ({ type: SET_IP_CONFIG_DIALOG_DNS_PRIMARY, dnsPrimary })
export const setIpConfigDialogDNSSecondary = (dnsSecondary) => ({ type: SET_IP_CONFIG_DIALOG_DNS_SECONDARY, dnsSecondary })