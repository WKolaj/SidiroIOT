export const mbVariableConverter = (variable) => {
  switch(variable.type) {
    case 'MBByteArray':
      return `[${variable.value}]`
    case 'MBSwappedFloat':
      return parseFloat(variable.value).toFixed(3)
    default:
      //integers
      return variable.value
  }
}