type Concat<T extends ReadonlyArray<unknown>, U extends readonly unknown[]> = [...T, ...U];


type MyFirst<T> = T extends [infer First, ...infer Rest] ? First : never;
type MyTail<T> = T extends [infer First, ...infer Rest] ? Rest : never

type A = MyFirst<[1, 2, 3]>
type A1 = MyFirst<1>
type B = MyTail<[1, 2, 3]>
