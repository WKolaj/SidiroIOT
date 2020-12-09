const splitValueToBytes = (valueToSplit) => {
  //Split int32 into bytes
  let int32Array = new Uint32Array(1);
  int32Array[0] = valueToSplit;
  let bytes = new Uint8Array(int32Array.buffer);

  return [bytes[3], bytes[2], bytes[1], bytes[0]];
};

let value = 134000;

//Bytes
// 0,1          -   Year    -   1990    =   [7,98]
// 2            -   Month   -   11
// 3            -   Day     -   30
// 4            -   Weekday -   6 (friday)
// 5            -   Hour    -   10
// 6            -   Min     -   11
// 7            -   Sec     -   12
// 8,9,10,11    -   Nanosec -   134000 ns = [ 0, 2, 11, 112 ]

let date = Date.UTC(1990, 11, 30, 10, 11, 12, 134);

let testDate = 1607348962459;
for (let i = 0; i < 7; i++) {
  console.log(new Date(testDate).getUTCDay() + 1);
  testDate += 24 * 60 * 60 * 1000;
}
