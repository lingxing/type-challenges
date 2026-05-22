// Push
type tuple = [1, 2, 3];
type MPush<Arr extends unknown[], Ele> = [...Arr, Ele]
type MPushTest = MPush<tuple, 'a'>

// Unshift
type MUnshif<Arr extends unknown[], Ele> = [Ele, ...Arr];
type MUnshifTest = MUnshif<tuple, 'a'>

// Zip
type tuple1 = [1, 2];
type tuple2 = ['guang', 'dong'];
type MZip<One extends unknown[], Other extends unknown[]> = One extends [infer OneFirst, ...infer OneRest] ? Other extends [infer OtherFirst, ...infer OtherRest] ? [[OneFirst, OtherFirst], ...MZip<OneRest, OtherRest>] : []: []
type MZipTest = MZip<tuple1, tuple2>

// CapitalizeStr
type MCapitalizeStr<Str extends string> = Str extends `${infer First}${infer Rest}`? `${Uppercase<First>}${Rest}` : Str
type MCapitalizeStrTest = MCapitalizeStr<'guang'>

// CamelCase
type MCamelCase<Str extends string> = Str extends `${infer Left}_${infer Right}${infer Rest}` ? `${Left}${Uppercase<Right>}${MCamelCase<Rest>}`: Str;
type MCamelCaseTest = MCamelCase<'dong_dong_dong'>

// DropSubStr
type MDropSubStr<Str extends string, SubStr extends string> = Str extends `${infer Prefix}${SubStr}${infer Suffix}` ? MDropSubStr<`${Prefix}${Suffix}`, SubStr>: Str
type MDropSubStrTest = MDropSubStr<'dong~~~~~~', '~'>;

// AppendArgument
type MAppendArgument<Func extends Function, Arg> = Func extends (...args: infer Args) => infer ReturnType ? (...args: [...Args, Arg]) => ReturnType : never;
type MAppendArgumentTest = MAppendArgument<(name: string, age: number)=>boolean, number>


type obj = {
  readonly name: string;
  age?: number;
  gender: boolean;
}

type Mapping<Obj extends object> = {
  [Key in keyof Obj]: [Obj[Key], Obj[Key], Obj[Key]]
}
type MappingTest = Mapping<{name: 'xh', age: 18, gender: 1}>

type UppercaseKey<Obj extends object> = {
  [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key]
}
type UppercaseKeyTest = UppercaseKey<{guang: 1, dong: 2}>

// Record
type MRecord<K extends string|number|symbol, T> = {
  [P in K] : T
}

type UppercaseKey2<Obj extends MRecord<string, any>> = {
  [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key]
}

// ToReadonly
type ToReadonly<T> = {
  readonly [Key in keyof T]: T[Key]
}
type ToReadonlyTest = ToReadonly<{name: string; age: number}>

// ToPartial
type ToPartial<T> = {
  [Key in keyof T]?: T[Key]
}
type ToPartialTest = ToPartial<{name: string; age: number}>

// ToMutable
type ToMutable<T> = {
  -readonly [Key in keyof T]: T[Key]
}
type ToMutableTest = ToMutable<{readonly name: string; age: number}>

// ToRequired
type ToRequired<T> = {
  [Key in keyof T]-?: T[Key]
}
type ToRequiredTest = ToRequired<{name?: string; age: number}>

// FilterByValueType
type FilterByValueType<Obj extends MRecord<string, any>, ValueType> = {
  [Key in keyof Obj as Obj[Key] extends ValueType ? Key : never] : Obj[Key]
}
interface Person {
  name: string;
  age: number;
  hobby: string[]
}
type FilterByValueTypeTest = FilterByValueType<Person, string | number>