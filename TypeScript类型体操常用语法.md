# TypeScript 类型体操常用语法

## 目录
- [基础类型操作](#基础类型操作)
- [条件类型](#条件类型)
- [infer 关键字](#infer-关键字)
- [模板字面量类型](#模板字面量类型)
- [映射类型](#映射类型)
- [递归类型](#递归类型)
- [联合类型与交叉类型](#联合类型与交叉类型)
- [常用工具类型](#常用工具类型)
- [实战技巧](#实战技巧)

---

## 基础类型操作

### 1. 类型约束 (extends)
```typescript
// 约束泛型参数必须是某种类型
type OnlyString<T extends string> = T
type Result = OnlyString<'hello'>  // ✅
// type Error = OnlyString<123>    // ❌ 类型错误

// 约束对象必须有某些属性
type HasId<T extends { id: number }> = T
```

### 2. 类型别名
```typescript
type Name = string
type Age = number
type User = { name: Name; age: Age }
```

### 3. 联合类型 (|)
```typescript
type Status = 'pending' | 'success' | 'error'
type ID = string | number
```

### 4. 交叉类型 (&)
```typescript
type Person = { name: string }
type Employee = { id: number }
type Staff = Person & Employee  // { name: string; id: number }
```

---

## 条件类型

### 基本语法
```typescript
T extends U ? X : Y
```

### 示例
```typescript
// 判断类型
type IsString<T> = T extends string ? true : false
type A = IsString<'hello'>  // true
type B = IsString<123>      // false

// 类型过滤
type NonNullable<T> = T extends null | undefined ? never : T
type C = NonNullable<string | null>  // string

// 嵌套条件
type TypeName<T> = 
  T extends string ? 'string' :
  T extends number ? 'number' :
  T extends boolean ? 'boolean' :
  'object'
```

---

## infer 关键字

### 作用
在条件类型中推断（提取）类型

### 1. 提取函数返回值
```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type Func = () => string
type Result = ReturnType<Func>  // string
```

### 2. 提取函数参数
```typescript
type Parameters<T> = T extends (...args: infer P) => any ? P : never

type Func = (a: string, b: number) => void
type Params = Parameters<Func>  // [string, number]
```

### 3. 提取数组元素类型
```typescript
type ArrayElement<T> = T extends (infer E)[] ? E : never

type Arr = string[]
type Element = ArrayElement<Arr>  // string
```

### 4. 提取 Promise 的值类型
```typescript
type Awaited<T> = T extends Promise<infer U> ? U : T

type P = Promise<string>
type Value = Awaited<P>  // string
```

### 5. 提取对象属性类型
```typescript
type User = { name: string; age: number }
type NameType = User['name']  // string
```

---

## 模板字面量类型

### 基本语法
```typescript
type Greeting = `Hello ${string}`
```

### 1. 字符串拼接
```typescript
type World = 'World'
type Greeting = `Hello ${World}`  // "Hello World"

// 联合类型会展开
type Color = 'red' | 'blue'
type Size = 'small' | 'large'
type Style = `${Color}-${Size}`  
// "red-small" | "red-large" | "blue-small" | "blue-large"
```

### 2. 字符串模式匹配
```typescript
// 匹配开头
type StartsWithHello<S extends string> = 
  S extends `Hello ${infer Rest}` ? Rest : never

type A = StartsWithHello<'Hello World'>  // "World"

// 匹配结尾
type EndsWithWorld<S extends string> = 
  S extends `${infer Start} World` ? Start : never

type B = EndsWithWorld<'Hello World'>  // "Hello"

// 匹配中间
type ExtractMiddle<S extends string> = 
  S extends `${infer L} ${infer M} ${infer R}` ? M : never

type C = ExtractMiddle<'Hello Beautiful World'>  // "Beautiful"
```

### 3. 字符串操作
```typescript
// 首字母大写
type Capitalize<S extends string> = 
  S extends `${infer First}${infer Rest}` 
    ? `${Uppercase<First>}${Rest}` 
    : S

// 首字母小写
type Uncapitalize<S extends string> = 
  S extends `${infer First}${infer Rest}` 
    ? `${Lowercase<First>}${Rest}` 
    : S

// 全部大写/小写
type Upper = Uppercase<'hello'>  // "HELLO"
type Lower = Lowercase<'HELLO'>  // "hello"
```

### 4. 字符串替换
```typescript
// 替换一次
type Replace<
  S extends string,
  From extends string,
  To extends string
> = From extends ''
  ? S
  : S extends `${infer Left}${From}${infer Right}`
    ? `${Left}${To}${Right}`
    : S

// 替换所有
type ReplaceAll<
  S extends string,
  From extends string,
  To extends string
> = From extends ''
  ? S
  : S extends `${infer Left}${From}${infer Right}`
    ? `${Left}${To}${ReplaceAll<Right, From, To>}`
    : S
```

### 5. 去除空格
```typescript
type Space = ' ' | '\n' | '\t'

// 去除左边空格
type TrimLeft<S extends string> = 
  S extends `${Space}${infer R}` ? TrimLeft<R> : S

// 去除右边空格
type TrimRight<S extends string> = 
  S extends `${infer L}${Space}` ? TrimRight<L> : S

// 去除两边空格
type Trim<S extends string> = 
  S extends `${Space}${infer R}` | `${infer R}${Space}` 
    ? Trim<R> 
    : S
```

---

## 映射类型

### 基本语法
```typescript
type Mapped<T> = {
  [K in keyof T]: T[K]
}
```

### 1. 遍历对象属性
```typescript
// 所有属性变为可选
type Partial<T> = {
  [K in keyof T]?: T[K]
}

// 所有属性变为必选
type Required<T> = {
  [K in keyof T]-?: T[K]  // -? 移除可选
}

// 所有属性变为只读
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

// 移除只读
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]  // -readonly 移除只读
}
```

### 2. 属性过滤
```typescript
// Pick: 选择部分属性
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// Omit: 排除部分属性
type Omit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}
```

### 3. 键名重映射 (as)
```typescript
// 给所有键名加前缀
type Prefixed<T> = {
  [K in keyof T as `prefix_${K & string}`]: T[K]
}

type User = { name: string; age: number }
type PrefixedUser = Prefixed<User>
// { prefix_name: string; prefix_age: number }

// 过滤特定类型的属性
type FilterByType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K]
}

type User = { name: string; age: number; active: boolean }
type StringProps = FilterByType<User, string>  // { name: string }
```

---

## 递归类型

### 1. 数组递归
```typescript
// 数组扁平化
type Flatten<T extends any[]> = 
  T extends [infer First, ...infer Rest]
    ? First extends any[]
      ? [...Flatten<First>, ...Flatten<Rest>]
      : [First, ...Flatten<Rest>]
    : []

type Nested = [1, [2, [3, 4]], 5]
type Flat = Flatten<Nested>  // [1, 2, 3, 4, 5]

// 数组反转
type Reverse<T extends any[]> = 
  T extends [infer First, ...infer Rest]
    ? [...Reverse<Rest>, First]
    : []

type Arr = [1, 2, 3]
type Rev = Reverse<Arr>  // [3, 2, 1]
```

### 2. 字符串递归
```typescript
// 字符串转数组
type StringToArray<
  S extends string,
  Acc extends string[] = []
> = S extends `${infer First}${infer Rest}`
  ? StringToArray<Rest, [...Acc, First]>
  : Acc

type Chars = StringToArray<'hello'>  // ['h', 'e', 'l', 'l', 'o']

// 字符串反转
type ReverseString<
  S extends string,
  Acc extends string = ''
> = S extends `${infer First}${infer Rest}`
  ? ReverseString<Rest, `${First}${Acc}`>
  : Acc

type Rev = ReverseString<'hello'>  // "olleh"
```

### 3. 对象深度递归
```typescript
// 深度只读
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K]
}

// 深度可选
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? DeepPartial<T[K]>
    : T[K]
}
```

### 4. 递归终止条件
```typescript
// 使用 never 终止
type Process<T> = T extends SomeCondition ? Process<...> : never

// 使用原值终止
type Process<T> = T extends SomeCondition ? Process<...> : T

// 使用空数组/空字符串终止
type Process<T extends any[]> = T extends [] ? [] : ...
type Process<S extends string> = S extends '' ? '' : ...
```

---

## 联合类型与交叉类型

### 1. 联合类型分发
```typescript
// 条件类型会自动分发联合类型
type ToArray<T> = T extends any ? T[] : never

type Result = ToArray<string | number>
// string[] | number[] (分发)
// 而不是 (string | number)[]
```

### 2. 阻止分发
```typescript
// 使用元组包裹
type ToArray<T> = [T] extends [any] ? T[] : never

type Result = ToArray<string | number>
// (string | number)[]
```

### 3. 联合类型转交叉类型
```typescript
type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends 
  (k: infer I) => void 
    ? I 
    : never

type Union = { a: string } | { b: number }
type Intersection = UnionToIntersection<Union>
// { a: string } & { b: number }
```

### 4. 提取联合类型的最后一个
```typescript
type LastInUnion<U> = UnionToIntersection<
  U extends any ? (x: U) => void : never
> extends (x: infer L) => void
  ? L
  : never

type Union = 'a' | 'b' | 'c'
type Last = LastInUnion<Union>  // 'c'
```

---

## 常用工具类型

### 1. 内置工具类型
```typescript
// Partial<T> - 所有属性可选
// Required<T> - 所有属性必选
// Readonly<T> - 所有属性只读
// Pick<T, K> - 选择属性
// Omit<T, K> - 排除属性
// Record<K, T> - 创建对象类型
// Exclude<T, U> - 从 T 中排除 U
// Extract<T, U> - 从 T 中提取 U
// NonNullable<T> - 排除 null 和 undefined
// ReturnType<T> - 函数返回值类型
// Parameters<T> - 函数参数类型
// InstanceType<T> - 构造函数实例类型
```

### 2. 自定义工具类型
```typescript
// 获取对象所有值的类型
type ValueOf<T> = T[keyof T]

type User = { name: string; age: number }
type UserValue = ValueOf<User>  // string | number

// 获取数组长度
type Length<T extends any[]> = T['length']

type Arr = [1, 2, 3]
type Len = Length<Arr>  // 3

// 判断两个类型是否相等
type Equal<X, Y> = 
  (<T>() => T extends X ? 1 : 2) extends 
  (<T>() => T extends Y ? 1 : 2) 
    ? true 
    : false

// 判断是否为 any
type IsAny<T> = 0 extends (1 & T) ? true : false

// 判断是否为 never
type IsNever<T> = [T] extends [never] ? true : false

// 判断是否为联合类型
type IsUnion<T, U = T> = 
  T extends U 
    ? [U] extends [T] 
      ? false 
      : true 
    : never
```

---

## 实战技巧

### 1. 边界条件处理
```typescript
// 总是先检查空字符串
type Process<S extends string> = 
  S extends '' 
    ? '' 
    : // 正常逻辑

// 总是先检查空数组
type Process<T extends any[]> = 
  T extends [] 
    ? [] 
    : // 正常逻辑

// 检查 never
type Process<T> = 
  [T] extends [never] 
    ? never 
    : // 正常逻辑
```

### 2. 累加器模式
```typescript
// 使用额外的泛型参数作为累加器
type Reverse<
  T extends any[],
  Acc extends any[] = []  // 累加器
> = T extends [infer First, ...infer Rest]
  ? Reverse<Rest, [First, ...Acc]>
  : Acc
```

### 3. 辅助类型
```typescript
// 定义辅助类型简化逻辑
type Space = ' ' | '\n' | '\t'
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type Letter = 'a' | 'b' | 'c' // ... 等等
```

### 4. 递归深度限制
```typescript
// TypeScript 递归深度限制约为 50 层
// 可以使用尾递归优化或分段处理

// 尾递归优化示例
type TailRecursive<T, Acc = []> = 
  // 使用累加器避免深层嵌套
  ...
```

### 5. 调试技巧
```typescript
// 使用类型别名查看中间结果
type Debug<T> = T
type Step1 = Debug<SomeType>

// 使用 Expect 和 Equal 测试
type Test = Expect<Equal<Result, Expected>>

// 查看类型展开
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
```

### 6. 性能优化
```typescript
// 避免不必要的递归
// ❌ 每次都递归
type Bad<T> = T extends any ? Process<T> : never

// ✅ 先判断再递归
type Good<T> = T extends NeedProcess ? Process<T> : T

// 使用分发特性
type Distribute<T> = T extends any ? [T] : never
```

---

## 常见模式总结

### 模式 1: 提取-处理-组合
```typescript
type Process<S> = S extends `${infer L}${infer M}${infer R}`
  ? `${Handle(L)}${Handle(M)}${Handle(R)}`
  : S
```

### 模式 2: 递归-累加
```typescript
type Process<T, Acc = Init> = 
  T extends [infer First, ...infer Rest]
    ? Process<Rest, Update<Acc, First>>
    : Acc
```

### 模式 3: 条件-分发
```typescript
type Process<T> = T extends Condition
  ? HandleTrue<T>
  : HandleFalse<T>
```

### 模式 4: 映射-过滤
```typescript
type Process<T> = {
  [K in keyof T as Filter<K>]: Transform<T[K]>
}
```

---

## 高级技巧

### 1. 元组操作

#### 元组转联合类型
```typescript
type TupleToUnion<T extends any[]> = T[number]

type Tuple = [string, number, boolean]
type Union = TupleToUnion<Tuple>  // string | number | boolean
```

#### 元组转对象
```typescript
type TupleToObject<T extends readonly (string | number | symbol)[]> = {
  [K in T[number]]: K
}

type Tuple = ['name', 'age'] as const
type Obj = TupleToObject<Tuple>  // { name: 'name', age: 'age' }
```

#### 元组拼接
```typescript
type Concat<T extends any[], U extends any[]> = [...T, ...U]

type Result = Concat<[1, 2], [3, 4]>  // [1, 2, 3, 4]
```

#### 元组头尾操作
```typescript
// 获取第一个元素
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never

// 获取最后一个元素
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never

// 去掉第一个元素
type Tail<T extends any[]> = T extends [any, ...infer R] ? R : []

// 去掉最后一个元素
type Init<T extends any[]> = T extends [...infer I, any] ? I : []
```

#### 元组 Push/Unshift
```typescript
type Push<T extends any[], U> = [...T, U]
type Unshift<T extends any[], U> = [U, ...T]

type Arr1 = Push<[1, 2], 3>      // [1, 2, 3]
type Arr2 = Unshift<[1, 2], 0>   // [0, 1, 2]
```

### 2. 数字运算

#### 构建数字数组
```typescript
type BuildArray<
  N extends number,
  Acc extends any[] = []
> = Acc['length'] extends N
  ? Acc
  : BuildArray<N, [...Acc, any]>

type Arr = BuildArray<5>  // [any, any, any, any, any]
```

#### 数字加法
```typescript
type Add<A extends number, B extends number> = 
  [...BuildArray<A>, ...BuildArray<B>]['length']

type Sum = Add<3, 5>  // 8
```

#### 数字减法
```typescript
type Subtract<A extends number, B extends number> = 
  BuildArray<A> extends [...BuildArray<B>, ...infer R]
    ? R['length']
    : never

type Diff = Subtract<5, 3>  // 2
```

#### 数字比较
```typescript
type GreaterThan<
  A extends number,
  B extends number,
  Acc extends any[] = []
> = A extends Acc['length']
  ? false
  : B extends Acc['length']
    ? true
    : GreaterThan<A, B, [...Acc, any]>

type Result = GreaterThan<5, 3>  // true
```

### 3. 字符串高级操作

#### 字符串长度
```typescript
type StringLength<
  S extends string,
  Acc extends any[] = []
> = S extends `${infer F}${infer R}`
  ? StringLength<R, [...Acc, F]>
  : Acc['length']

type Len = StringLength<'hello'>  // 5
```

#### 字符串分割
```typescript
type Split<
  S extends string,
  Delimiter extends string
> = S extends `${infer Left}${Delimiter}${infer Right}`
  ? [Left, ...Split<Right, Delimiter>]
  : S extends ''
    ? []
    : [S]

type Parts = Split<'a-b-c', '-'>  // ['a', 'b', 'c']
```

#### 字符串连接
```typescript
type Join<
  T extends string[],
  Delimiter extends string = ''
> = T extends [infer First extends string, ...infer Rest extends string[]]
  ? Rest extends []
    ? First
    : `${First}${Delimiter}${Join<Rest, Delimiter>}`
  : ''

type Joined = Join<['a', 'b', 'c'], '-'>  // 'a-b-c'
```

#### 驼峰转换
```typescript
// kebab-case 转 camelCase
type KebabToCamel<S extends string> = 
  S extends `${infer Left}-${infer Right}`
    ? `${Left}${KebabToCamel<Capitalize<Right>>}`
    : S

type Camel = KebabToCamel<'foo-bar-baz'>  // 'fooBarBaz'

// camelCase 转 kebab-case
type CamelToKebab<S extends string> = 
  S extends `${infer First}${infer Rest}`
    ? First extends Uppercase<First>
      ? `-${Lowercase<First>}${CamelToKebab<Rest>}`
      : `${First}${CamelToKebab<Rest>}`
    : S

type Kebab = CamelToKebab<'fooBarBaz'>  // 'foo-bar-baz'
```

#### 字符串包含判断
```typescript
type Includes<S extends string, Sub extends string> = 
  S extends `${infer L}${Sub}${infer R}` ? true : false

type Result = Includes<'hello world', 'world'>  // true
```

#### 字符串开头/结尾判断
```typescript
type StartsWith<S extends string, Prefix extends string> = 
  S extends `${Prefix}${infer Rest}` ? true : false

type EndsWith<S extends string, Suffix extends string> = 
  S extends `${infer Start}${Suffix}` ? true : false
```

### 4. 对象高级操作

#### 深度合并
```typescript
type Merge<T, U> = {
  [K in keyof T | keyof U]: K extends keyof U
    ? U[K]
    : K extends keyof T
      ? T[K]
      : never
}

type DeepMerge<T, U> = {
  [K in keyof T | keyof U]: K extends keyof U
    ? K extends keyof T
      ? T[K] extends object
        ? U[K] extends object
          ? DeepMerge<T[K], U[K]>
          : U[K]
        : U[K]
      : U[K]
    : K extends keyof T
      ? T[K]
      : never
}
```

#### 对象路径类型
```typescript
// 获取对象所有路径
type Paths<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${Paths<T[K]>}`
          : K
        : never
    }[keyof T]
  : never

type User = {
  name: string
  address: {
    city: string
    street: string
  }
}
type UserPaths = Paths<User>  
// 'name' | 'address' | 'address.city' | 'address.street'
```

#### 根据路径获取值类型
```typescript
type GetByPath<T, Path extends string> = 
  Path extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
      ? GetByPath<T[Key], Rest>
      : never
    : Path extends keyof T
      ? T[Path]
      : never

type CityType = GetByPath<User, 'address.city'>  // string
```

#### 对象键值互换
```typescript
type Flip<T extends Record<string, string | number>> = {
  [K in keyof T as `${T[K]}`]: K
}

type Original = { a: 'x', b: 'y' }
type Flipped = Flip<Original>  // { x: 'a', y: 'b' }
```

#### 移除索引签名
```typescript
type RemoveIndexSignature<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
      ? never
      : symbol extends K
        ? never
        : K]: T[K]
}
```

### 5. 函数类型操作

#### 柯里化
```typescript
type Curry<F> = F extends (...args: infer Args) => infer Return
  ? Args extends [infer First, ...infer Rest]
    ? (arg: First) => Curry<(...args: Rest) => Return>
    : Return
  : never

type Fn = (a: string, b: number, c: boolean) => void
type Curried = Curry<Fn>
// (arg: string) => (arg: number) => (arg: boolean) => void
```

#### 函数重载
```typescript
type AppendArgument<Fn, A> = 
  Fn extends (...args: infer Args) => infer Return
    ? (...args: [...Args, A]) => Return
    : never

type Fn = (a: string) => number
type NewFn = AppendArgument<Fn, boolean>
// (a: string, arg_1: boolean) => number
```

### 6. 类型守卫与断言

#### 自定义类型守卫
```typescript
type IsString<T> = T extends string ? true : false
type IsNumber<T> = T extends number ? true : false
type IsArray<T> = T extends any[] ? true : false
type IsFunction<T> = T extends (...args: any[]) => any ? true : false
type IsObject<T> = T extends object ? true : false
type IsPrimitive<T> = T extends string | number | boolean | null | undefined | symbol | bigint ? true : false
```

#### 类型窄化
```typescript
type Narrow<T, U> = T extends U ? T : never

type Union = string | number | boolean
type OnlyString = Narrow<Union, string>  // string
```

### 7. 模式匹配技巧

#### 可选链模式
```typescript
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

type User = {
  name: string
  age?: number
  email?: string
}
type Optional = OptionalKeys<User>  // 'age' | 'email'
type Required = RequiredKeys<User>  // 'name'
```

#### 函数属性过滤
```typescript
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]

type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]
```

### 8. Promise 类型操作

#### 深度 Awaited
```typescript
type DeepAwaited<T> = T extends Promise<infer U>
  ? DeepAwaited<U>
  : T extends object
    ? { [K in keyof T]: DeepAwaited<T[K]> }
    : T

type Nested = Promise<Promise<{ data: Promise<string> }>>
type Result = DeepAwaited<Nested>  // { data: string }
```

#### Promise 数组
```typescript
type PromiseAll<T extends any[]> = Promise<{
  [K in keyof T]: T[K] extends Promise<infer U> ? U : T[K]
}>

type Promises = [Promise<string>, Promise<number>, boolean]
type Result = PromiseAll<Promises>  // Promise<[string, number, boolean]>
```

### 9. 类型体操常见陷阱

#### 陷阱 1: 分布式条件类型
```typescript
// 会分发
type ToArray<T> = T extends any ? T[] : never
type Result1 = ToArray<string | number>  // string[] | number[]

// 不会分发
type ToArray2<T> = [T] extends [any] ? T[] : never
type Result2 = ToArray2<string | number>  // (string | number)[]
```

#### 陷阱 2: never 的特殊性
```typescript
// never 会被忽略
type Union = string | never  // string

// 检查 never 需要用元组包裹
type IsNever<T> = [T] extends [never] ? true : false
```

#### 陷阱 3: 空字符串匹配
```typescript
// ❌ 空字符串会匹配任意位置
type Bad<S extends string> = 
  S extends `${infer L}${''}${infer R}` ? [L, R] : never

// ✅ 先检查空字符串
type Good<S extends string> = 
  S extends '' ? never : // 处理逻辑
```

#### 陷阱 4: 协变与逆变
```typescript
// 函数参数是逆变的
type Contravariant<T> = (arg: T) => void

// 函数返回值是协变的
type Covariant<T> = () => T

// 利用逆变实现联合转交叉
type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends 
  (k: infer I) => void 
    ? I 
    : never
```

### 10. 实用工具类型集合

```typescript
// 可选属性转必选
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> & 
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

// 互斥属性
type XOR<T, U> = 
  (T | U) extends object 
    ? (Without<T, U> & U) | (Without<U, T> & T) 
    : T | U

type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]?: never
}

// 只读部分属性
type PartialReadonly<T, K extends keyof T> = 
  Omit<T, K> & Readonly<Pick<T, K>>

// 可变部分属性
type PartialMutable<T, K extends keyof T> = 
  Omit<T, K> & { -readonly [P in K]: T[P] }

// 获取可写属性
type WritableKeys<T> = {
  [K in keyof T]-?: (<F>() => F extends { [Q in K]: T[K] } ? 1 : 2) extends
    (<F>() => F extends { -readonly [Q in K]: T[K] } ? 1 : 2)
    ? K
    : never
}[keyof T]

// 类型差集
type Diff<T, U> = Pick<T, Exclude<keyof T, keyof U>>

// 类型交集
type Intersection<T, U> = Pick<T, Extract<keyof T, keyof U>>

// 覆盖类型
type Overwrite<T, U> = Omit<T, keyof U> & U

// 可为空
type Nullable<T> = T | null
type Nullish<T> = T | null | undefined

// 非空
type NonNullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? never : undefined extends T[K] ? never : K
}[keyof T]

// 函数属性转 Promise
type Promisify<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => infer Return
    ? (...args: Args) => Promise<Return>
    : T[K]
}

// 构造函数参数
type ConstructorParameters<T extends abstract new (...args: any) => any> = 
  T extends abstract new (...args: infer P) => any ? P : never

// 获取 getter 返回类型
type GetAccessorType<T> = T extends { get(): infer R } ? R : never
```

### 11. 类型编程模式

#### 状态机模式
```typescript
type State = 'idle' | 'loading' | 'success' | 'error'

type Transitions = {
  idle: 'loading'
  loading: 'success' | 'error'
  success: 'idle'
  error: 'idle'
}

type NextState<S extends State> = S extends keyof Transitions
  ? Transitions[S]
  : never
```

#### 构建器模式
```typescript
type Builder<T, Built = {}> = {
  [K in keyof T]: (value: T[K]) => Builder<Omit<T, K>, Built & Record<K, T[K]>>
} & {
  build: keyof T extends keyof Built ? () => Built : never
}
```

#### 管道模式
```typescript
type Pipe<T, Fns extends Array<(arg: any) => any>> = 
  Fns extends [infer First extends (arg: any) => any, ...infer Rest extends Array<(arg: any) => any>]
    ? Pipe<ReturnType<First>, Rest>
    : T
```

---

## 学习资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [TypeScript 类型体操通关秘籍](https://juejin.cn/book/7047524421182947366)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [TypeScript 类型编程](https://github.com/microsoft/TypeScript/wiki)

---

## 速查表

### 常用操作符
- `extends` - 类型约束、条件判断
- `infer` - 类型推断
- `keyof` - 获取对象键
- `typeof` - 获取值的类型
- `in` - 遍历键
- `as` - 类型断言、键名重映射
- `?` - 可选属性
- `-?` - 移除可选
- `readonly` - 只读属性
- `-readonly` - 移除只读
- `&` - 交叉类型
- `|` - 联合类型
- `never` - 永不类型
- `unknown` - 未知类型
- `any` - 任意类型

### 内置工具类型速查
```typescript
Partial<T>              // 所有属性可选
Required<T>             // 所有属性必选
Readonly<T>             // 所有属性只读
Pick<T, K>              // 选择属性
Omit<T, K>              // 排除属性
Record<K, T>            // 键值对类型
Exclude<T, U>           // 从 T 排除 U
Extract<T, U>           // 从 T 提取 U
NonNullable<T>          // 排除 null/undefined
ReturnType<T>           // 函数返回类型
Parameters<T>           // 函数参数类型
ConstructorParameters<T> // 构造函数参数
InstanceType<T>         // 实例类型
ThisParameterType<T>    // this 参数类型
OmitThisParameter<T>    // 移除 this 参数
ThisType<T>             // this 上下文类型
Uppercase<S>            // 转大写
Lowercase<S>            // 转小写
Capitalize<S>           // 首字母大写
Uncapitalize<S>         // 首字母小写
Awaited<T>              // Promise 解包
```

---

**提示**: 类型体操的核心是**模式匹配 + 递归 + 分布式条件类型**，多练习就能掌握！
