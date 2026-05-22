type arr = [1, 2, 3]
type GetFirst<Arr extends unknown[]> = Arr extends [infer First, ...unknown[]] ? First : never
type GetFirstTest = GetFirst<arr>
type GetLast<Arr extends unknown[]> = Arr extends [...unknown[], infer Last] ? Last : never
type GetLastTest = GetLast<arr>
type PopArr<Arr extends unknown[]> = Arr extends [] ? [] : Arr extends [...infer Rest, unknown] ? Rest : never
type PopArrText = PopArr<arr>
type ShiftArr<Arr extends unknown[]> = Arr extends [] ? [] : Arr extends [unknown, ...infer Rest] ? Rest : never
type ShiftArrTest = ShiftArr<arr>

type str = 'abc'
type MStartsWith<Str extends string, Prefix extends string> = Str extends `${Prefix}${string}` ? true : false
type MStartsWithTest = MStartsWith<str, 'a'>
type MReplaceStr<Str extends string, From extends string, To extends string> = Str extends `${infer Prefix}${From}${infer Suffix}` ? `${Prefix}${To}${Suffix}` : Str
type MReplaceStrTest = MReplaceStr<'my friend is Tom', 'Tom', 'Alice'>

type TrimStrRight<Str extends string> = Str extends `${infer Rest}${' ' | '\n' | '\t'}` ? TrimStrRight<Rest> : Str
type TrimStrRightTest = TrimStrRight<'my frend '>
type TrimStrLeft<Str extends string> = Str extends `${' ' | '\n' | '\t'}${infer Rest}` ? TrimStrLeft<Rest> : Str
type TrimStrLeftTest = TrimStrLeft<' my frend'>
type TrimStr<Str extends string> = TrimStrRight<TrimStrLeft<Str>>
type TrimStrTest = TrimStr<'  my friend '>

type MGetParameters<Func extends Function> = Func extends (...args: infer Args) => unknown ? Args : never
type MGetParametersTest = MGetParameters<(name: string, arge: number) => string>
type MGetReturnType<Func extends Function> = Func extends (...args: any[]) => infer ReturnType ? ReturnType : never
type MGetReturnTypeTest = MGetReturnType<(name: string, arge: number) => string>

class Dong {
  name: string
  constructor() {
    this.name = 'dong'
  }

  hello(this: Dong) {
    return `hello I'm ${this.name}`
  }
}
const dong = new Dong()
dong.hello()
// dong.hello.call({})
type GetThisParameterType<T> = T extends (this: infer ThisType, ...args: any[]) => any ? ThisType : unknown
type GetThisParameterTypeTest = GetThisParameterType<typeof dong.hello>

interface Person {
  name: string
}
interface PersonConstructor {
  new(name: string): Person
}

type GetInstanceType<ConstructorType extends new (...args: any) => any> = ConstructorType extends new (...args: any) => infer InstanceType ? InstanceType : any
type GetInstanceTypeTest = GetInstanceType<PersonConstructor>
type GetConstructorParameters<ConstructorType extends new (...args: any) => any> = ConstructorType extends new (...args: infer ParametersType) => any ? ParametersType : never
type GetConstructorParametersTest = GetConstructorParameters<PersonConstructor>

type GetRefProps<Props> = 'ref' extends keyof Props ? Props extends { ref?: infer Value | undefined } ? Value : never : never
type GetRefPropsTest = GetRefProps<{ ref?: 1, name: 'dong' }>
type GetRefPropsTest2 = GetRefProps<{ ref?: undefined, name: 'dong' }>
