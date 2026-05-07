type If<C extends boolean, T, F> = C extends true ? T: F


// function IF(C, T, F) {
//   return C ? T : F
// }
