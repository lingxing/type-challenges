type Unshift<T extends Array<unknown>, U> = [U, ...T]


function Unshift(T, U) {
  return [U, ...T]
}