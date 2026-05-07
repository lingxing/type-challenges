type MyReturnType<T> = T extends (...arg: infer X) => infer Y ? Y : never

// 取到返回到值
function MyReturnType(T) {
  return T()
}