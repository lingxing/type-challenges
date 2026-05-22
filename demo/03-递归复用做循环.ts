// DeepPromiseValueType
type ttt = Promise<Promise<Promise<Record<string, any>>>>;
type DeepPromiseValueType<P extends Promise<unknown>> = P extends Promise<infer ValueType> ? ValueType extends Promise<unknown> ? DeepPromiseValueType<ValueType> : ValueType : never
type DeepPromiseValueType2<T> = T extends Promise<infer ValueType> ? DeepPromiseValueType2<ValueType> : T
type DeepPromiseValueTypeTest = DeepPromiseValueType<ttt>
type DeepPromiseValueTypeTest2 = DeepPromiseValueType<ttt>

// ReverseArr
type arr1 = [1, 2, 3, 4, 5];
type arr2 = [5, 4, 3, 2, 1];
type ReverseArr<Arr extends unknown[]> = Arr extends [infer First, ...infer Rest] ? [...ReverseArr<Rest>, First] : Arr
type ReverseArrTest = ReverseArr<arr1>
type ReverseArrTest2 = ReverseArr<[]>

// Includes
type MIsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false);
type MIncludes<Arr extends unknown[], FindItem> = Arr extends [infer First, ...infer Rest] ?
  MIsEqual<First, FindItem> extends true ? true : MIncludes<Rest, FindItem>
  : false
type MIncludesTest = MIncludes<arr1, 5>

// RemoveItem
type MRemoveItem<Arr extends unknown[], Item, Result extends unknown[] = []> = Arr extends [infer First, ...infer Rest] ? MIsEqual<First, Item > extends true ? MRemoveItem<Rest, Item, Result>: MRemoveItem<Rest, Item, [...Result, First]> : Result
type MRemoveItemTest = MRemoveItem<arr1, 4>;

//BuildArray
type BuildArray<Length extends number, Ele = unknown, Arr extends unknown[] = []> = Arr['length'] extends Length ? Arr : BuildArray<Length, Ele, [...Arr, Ele]>;
type BuildArrayTest = BuildArray<5, 'a', ['a', 'b']>

// ReplaceAll
type ReplaceStr<Str extends string, From extends string, To extends string> = Str extends `${infer Prefix}${From}${infer Suffix}` ? `${Prefix}${To}${Suffix}`: Str
type ReplaceStrTest = ReplaceStr<'abcde', 'c', 'f'>
type MReplaceAll<Str extends string, From extends string, To extends string> = Str extends `${infer Left}${From}${infer Right}` ? `${Left}${To}${MReplaceAll<Right, From, To>}`: Str;
type MReplaceAllTest = MReplaceAll<'guang guang guang', 'guang', 'dong'>

// StringToUnion
type MStringToUnion<Str extends string> = Str extends `${infer First}${infer Rest}` ? First | MStringToUnion<Rest> : never;
type MStringToUnionTest = MStringToUnion<'dong'>;

// ReverseStr
type MReverseStr<Str extends string, Result extends string = ''> = Str extends `${infer First}${infer Rest}` ? MReverseStr<Rest, `${First}${Result}`>: Result;
type MReverseStrTest = MReverseStr<'abc'>

// DeepReadonly
type MDeepReadonly<Obj extends Record<string, any>> = Obj extends any ?{
  readonly [Key in keyof Obj]: Obj[Key] extends object ? Obj[Key] extends Function ? Obj[Key]: MDeepReadonly<Obj[Key]>: Obj[Key]
}: never;
type obj1 = {
    a: {
        b: {
            c: {
                f: () => 'dong',
                d: {
                    e: {
                        guang: string
                    }
                }
            }
        }
    }
}
type MDeepReadonlyTest = MDeepReadonly<obj1>
type MDeepReadonlyTestResult = MDeepReadonlyTest['a']