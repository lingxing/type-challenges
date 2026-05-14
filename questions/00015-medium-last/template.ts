// type Last<T extends any[]> = [never, ...T][T['length']]
type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never
type AA = Last<[3, 2, 1]>