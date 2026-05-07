type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}
interface Todo {
  title: string
  description: string
  completed: boolean
}
type A4 = MyOmit<Todo, 'title'>

function MyOmit(T, K) {
  const res = {};
  for (let item of K) {
    if (!T[item]) {
      res[item] = T[item];
    }
  }
  return res;
}