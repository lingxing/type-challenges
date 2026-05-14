// type GetFirst<S extends string> = S extends `${infer First}${infer Last}` ? `${Uppercase<First>}` : ''
// type GetLast<S extends string> = S extends `${infer First}${infer Last}` ? Last : ''
// type MyCapitalize<S extends string> = `${GetFirst<S>}${GetLast<S>}`
type MyCapitalize<S extends string> = S extends `${infer First}${infer Last}` ? `${Uppercase<First>}${Last}` : S

// type A110 = GetFirst<''>
// type A_110 = GetLast<''>
type A2_110 = MyCapitalize<''>
