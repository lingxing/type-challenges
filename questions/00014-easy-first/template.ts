type First<T extends any[]> = T extends [infer A, ...infer Last] ? A : never;
