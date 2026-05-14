type MyExclude<T, U> = T extends U ? never : T

type TEST = MyExclude<'a' | 'b' | 'c', 'a'>
