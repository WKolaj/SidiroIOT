import {
    SET_IP_CONFIG_DIALOG_OPEN,
    SET_IP_CONFIG_DIALOG_IP_ADDRESS,
    SET_IP_CONFIG_DIALOG_SUBNET_MASK,
    SET_IP_CONFIG_DIALOG_GATEWAY,
    SET_IP_CONFIG_DIALOG_DHCP,
    SET_IP_CONFIG_DIALOG_DNS_PRIMARY,
    SET_IP_CONFIG_DIALOG_DNS_SECONDARY
} from '../actions/IPconfigDialog.action';

const initialState = {
    //interface being edited name
    name: '',
    open: false,
    ipAddress: '',
    subnetMask: '',
    gateway: '',
    dhcp: false,
    dnsPrimary: '',
    dnsSecondary: ''
}

export const IPConfigReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_IP_CONFIG_DIALOG_OPEN:
            return {
                ...state,
                open: action.open,
                name: action.interfaceName ? action.interfaceName : ''
            }
        case SET_IP_CONFIG_DIALOG_IP_ADDRESS:
            return {
                ...state,
                ipAddress: action.ipAddress !==undefined ? action.ipAddress : ''
            }
        case SET_IP_CONFIG_DIALOG_SUBNET_MASK:
            return {
                ...state,
                subnetMask: action.subnetMask !==undefined ? action.subnetMask : ''
            }
        case SET_IP_CONFIG_DIALOG_GATEWAY:
            return {
                ...state,
                gateway: action.gateway !==undefined ? action.gateway : ''
            }
        case SET_IP_CONFIG_DIALOG_DHCP:
            return {
                ...state,
                dhcp: action.dhcp
            }
        case SET_IP_CONFIG_DIALOG_DNS_PRIMARY:
            return {
                ...state,
                dnsPrimary: action.dnsPrimary !==undefined ? action.dnsPrimary : ''
            }
        case SET_IP_CONFIG_DIALOG_DNS_SECONDARY:
            return {
                ...state,
                dnsSecondary: action.dnsSecondary !==undefined ? action.dnsSecondary : ''
            }
        default:
            return state
    }
}