export const sortRowsBy = (rows, cols, nameTranslationObject, variableSetType, sortBy1stLevel, sortBy2ndLevel, sortBy3rdLevel ) => {
  //modbus specific
  const MBUnitIDIndex = cols.findIndex(col => col === sortBy1stLevel)
  const MBFunctionIndex = cols.findIndex(col => col === sortBy2ndLevel)
  //s7 specific
  const S7MemoryTypeIndex = cols.findIndex(col => col === sortBy1stLevel)
  const S7DBNumberIndex = cols.findIndex(col => col === sortBy2ndLevel)
  //generic
  const offsetIndex = cols.findIndex(col => col === sortBy3rdLevel)
  const nameIndex = cols.findIndex(col => col === nameTranslationObject)

  if (variableSetType === 'MB') {
    //expanded table
    if (MBUnitIDIndex !== -1 && MBFunctionIndex !== -1 && offsetIndex !== -1) {
      rows.sort((a, b) => a[MBUnitIDIndex] - b[MBUnitIDIndex] || a[MBFunctionIndex] - b[MBFunctionIndex] || a[offsetIndex] - b[offsetIndex])
    }
    //simple view
    else {
      rows.sort((a, b) => a[nameIndex].localeCompare(b[nameIndex]))
    }
  }

  else if (variableSetType === 'S7') {
    //expanded table, memoryType === 'DB'
    if (S7MemoryTypeIndex !== -1 && S7DBNumberIndex !== -1 && offsetIndex !== -1) {
      rows.sort((a, b) => a[S7MemoryTypeIndex].localeCompare(b[S7MemoryTypeIndex]) || a[S7DBNumberIndex] - b[S7DBNumberIndex] || a[offsetIndex] - b[offsetIndex])
    }
    //simple view
    else {
      rows.sort((a, b) => a[nameIndex] - b[nameIndex])
    }
  }
 return rows
};