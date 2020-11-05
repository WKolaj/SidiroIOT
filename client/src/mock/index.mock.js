export const mockFetch = (payloadToReturn) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(payloadToReturn);
  }, 100);
});

export const MBDevice = (calcElement, alert) => {
  return {
    MBDevice1: {
      id: 'MBDevice1',
      name: 'PAC3220_1',
      type: 'MBDevice',
      variables: {
        variable1: {
          id: 'variable1',
          deviceId: 'MBDevice1',
          name: 'Variable 1',
          type: 'MBInt16',
          unit: 'V',
          sampleTime: 1000,
          defaultValue: 0,
          offset: 1,
          length: 3,
          read: true,
          write: true,
          readFCode: 1,
          writeFCode: 1,
          unitID: 1,
          readAsSingle: true,
          writeAsSingle: true
        }
      },
      calcElements: calcElement,
      alerts: alert,
      ipAddress: '192.168.1.10',
      portNumber: 3000,
      timeout: 10,
      isActive: true,
      isConnected: true
    }
  }
}

export const S7Device = (calcElement, alert) => {
  return {
    S7Device1: {
      id: 'S7Device1',
      name: 'S7-1200',
      type: 'S7Device',
      variables: {
        variable1: {
          id: 'variable1',
          deviceId: 'S7Device1',
          name: 'S7Device 1',
          type: 'S7Int16',
          unit: 'Unit',
          sampleTime: 100,
          defaultValue: 0,
          value: 0,
          offset: 1,
          length: 2,
          read: true,
          write: true,
          areaType: 'I',
          dbNumber: null,
          readAsSingle: false,
          writeAsSingle: false
        }
      },
      calcElements: calcElement,
      alerts: alert,
      ipAddress: '100.100.1.1',
      slot: 1,
      rack: 1,
      timeout: 1000,
      isActive: true,
      isConnected: true
    }
  }
}

export const InternalDevice = (calcElement, alert) => {
  return {
    InternalDevice1: {
      id: 'InternalDevice1',
      name: 'Internal Device 1',
      type: 'InternalDevice',
      variables: {
        variable1: {
          id: 'variable1',
          deviceId: 'InternalDevice1',
          name: 'Variable 1',
          type: 'InternalBool',
          unit: 'Unit',
          sampleTime: 10,
          defaultValue: 0,
          value: 0,
          read: false,
          write: false
        }
      },
      calcElements: calcElement,
      alerts: alert,
    }
  }
}

export const MSAgent = (calcElement, alert) => {
  return {
    MSAgent1: {
      id: 'MSAgent1',
      name: 'MSAgent 1',
      type: 'MSAgent',
      variables: {
        variable1: {
          id: 'variable1',
          deviceId: 'MSAgent1',
          AssociatedDeviceId: 'AssociatedDeviceId',
          AssociatedElementId: 'AssociatedElementId',
          name: 'variable 1',
          type: 'AssociatedVariable',
          unit: 'Unit',
          sampleTime: 100,
          defaultValue: 0,
          value: 0
        }
      },
      calcElements: calcElement,
      alerts: alert,
      sendingEnabled: true,
      sendFileLimit: 100,
      sendEventLimit: 100,
      sendingInterval: 1000,
      numberOfSendRetries: 2,
      datapoints: {
        datapoint1: {
          variableId: 'datapoint1',
          datapoint: 'datapoint',
          valueConverterObject: {
            format: 'fixed', //or precision
            length: 1
          }
        }
      },
      boarded: false
    }
  }
}


export const calcElement = (type) => {
  switch (type) {
    case 'AverageCalculator':
      return {
        AverageCalculator1: {
          id: 'AverageCalculator1',
          deviceId: 'deviceId',
          name: 'Average Calculator 1',
          type: 'AverageCalculator',
          unit: 'Unit',
          sampleTime: 10,
          defaultValue: 0,
          value: 0,
          variableId: 'variableId',
          factor: 1,
          calculationInterval: 1000
        }
      }
    case 'FactorCalculator':
      return {
        FactorCalculator1: {
          id: 'FactorCalculator1',
          deviceId: 'deviceId',
          name: 'Factor Calculator 1',
          type: 'FactorCalculator',
          unit: 'Unit',
          sampleTime: 10,
          defaultValue: 0,
          value: 0,
          variableId: 'variableId',
          factor: 1,
        }
      }
    case 'IncreaseCalculator':
      return {
        IncreaseCalculator1: {
          id: 'IncreaseCalculator1',
          deviceId: 'deviceId',
          name: 'Increase Calculator 1',
          type: 'IncreaseCalculator',
          unit: 'Unit',
          sampleTime: 10,
          defaultValue: 0,
          value: 0,
          variableId: 'variableId',
          factor: 1,
          calculationInterval: 1000,
          overflow: 1
        }
      }
    case 'SumCalculator':
      return {
        SumCalculator1: {
          id: 'SumCalculator1',
          deviceId: 'deviceId',
          name: 'Sum Calculator 1',
          type: 'SumCalculator',
          unit: 'Unit',
          sampleTime: 10,
          defaultValue: 0,
          value: 0,
          variableIds: {
            variableId: 'variableId',
            factor: 1
          }
        }
      }
    case 'ValueFromByteArrayCalculator':
      return {
        ValueFromByteArrayCalculator1: {
          id: 'ValueFromByteArrayCalculator1',
          deviceId: 'deviceId',
          name: 'Value From Byte Array Calculator 1',
          type: 'ValueFromByteArrayCalculator',
          unit: 'Unit',
          sampleTime: 10,
          defaultValue: 0,
          value: 0,
          variableId: 'variableId',
          bitNumber: 1,
          byteNumber: 2,
          length: 2
        }
      }
    default:
      return {}
  }
}

export const alert = (type) => {
  switch (type) {
    case 'HighLimitAlert':
      return {
        alert1: {
          id: 'alert1',
          deviceId: 'deviceId',
          name: 'High Limit Alert 1',
          type: 'HighLimitAlert',
          unit: 'Unit',
          sampleTime: 1,
          defaultValue: 0,
          value: 0,
          variableId: 'variableId',
          highLimit: 100,
          texts: {
            en: { 
              alert1: "Going above limit", 
              alert2: "Going below limit" 
            },
            pl: { 
              alert1: "Przekroczenie limitu", 
              alert2: "Powrót do poprawnej wartości" 
            }
          },
          severity: 1,
          hysteresis: 10,
          timeDelayOn: 1000,
          timeDelayOff: 1000
        }
      }
    case 'LowLimitAlert':
      return {
        alert1: {
          id: 'alert1',
          deviceId: 'deviceId',
          name: 'Low Limit Alert 1',
          type: 'LowLimitAlert',
          unit: 'Unit',
          sampleTime: 1,
          defaultValue: 0,
          value: 0,
          variableId: 'variableId',
          lowLimit: 10,
          texts: {
            en: { 
              alert1: "Going above limit", 
              alert2: "Going below limit" 
            },
            pl: { 
              alert1: "Przekroczenie limitu", 
              alert2: "Powrót do poprawnej wartości" 
            }
          },
          severity: 1,
          hysteresis: 10,
          timeDelayOn: 1000,
          timeDelayOff: 1000
        }
      }
    case 'BandwidthLimitAlert':
      return {
        alert1: {
          id: 'alert1',
          deviceId: 'deviceId',
          name: 'Bandwidth Limit Alert 1',
          type: 'BandwidthLimitAlert',
          unit: 'Unit',
          sampleTime: 1,
          defaultValue: 0,
          value: 0,
          variableId: 'variableId',
          highLimit: 100,
          lowLimit: 10,
          texts: {
            en: { 
              alert1: "Going above limit", 
              alert2: "Going below limit" 
            },
            pl: { 
              alert1: "Przekroczenie limitu", 
              alert2: "Powrót do poprawnej wartości" 
            }
          },
          severity: 1,
          inverseLogic: true,
          hysteresis: 10,
          timeDelayOn: 1000,
          timeDelayOff: 1000
        }
      }
    case 'ExactValuesAlert':
      return {
        alert1: {
          id: 'alert1',
          deviceId: 'deviceId',
          name: 'Exact Values Alert 1',
          type: 'ExactValuesAlert',
          unit: 'Unit',
          sampleTime: 1,
          defaultValue: 0,
          value: 0,
          variableId: 'variableId',
          alertValues: [10, 15],
          texts: {
            10: {
              lang: 'en',
              text: 'Exact Values Alert 10'
            },
            15: {
              lang: 'en',
              text: 'Exact Values Alert 15'
            }
          },
          severity: 1,
          timeDelayOn: 1000,
          timeDelayOff: 1000
        }
      }
    default:
      return {}
  }
}

