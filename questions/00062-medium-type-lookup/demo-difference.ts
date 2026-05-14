// ============================================
// 1. 对象类型的分布式条件类型
// ============================================

interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Bulldog'
  color: 'brown' | 'white'
}

type Animal = Cat | Dog

// 对象类型：检查对象是否有特定的 type 属性
type LookUp<U, T> = U extends { type: T } ? U : never

type DogType = LookUp<Animal, 'dog'>  // Dog
type CatType = LookUp<Animal, 'cat'>  // Cat

// 分发过程：
// LookUp<Cat | Dog, 'dog'>
// = (Cat extends {type: 'dog'} ? Cat : never) | (Dog extends {type: 'dog'} ? Dog : never)
// = never | Dog
// = Dog


// ============================================
// 2. 原始类型的分布式条件类型
// ============================================

type TypeUnion = 'cat' | 'dog' | 'bird'

// 原始类型：直接比较值
type FilterType<U, T> = U extends T ? U : never

type OnlyDog = FilterType<TypeUnion, 'dog'>  // 'dog'
type OnlyCat = FilterType<TypeUnion, 'cat'>  // 'cat'

// 分发过程：
// FilterType<'cat' | 'dog' | 'bird', 'dog'>
// = ('cat' extends 'dog' ? 'cat' : never) | ('dog' extends 'dog' ? 'dog' : never) | ('bird' extends 'dog' ? 'bird' : never)
// = never | 'dog' | never
// = 'dog'


// ============================================
// 3. 关键区别演示
// ============================================

// 对象类型：检查结构兼容性
type ObjectCheck = Dog extends { type: 'dog' } ? true : false  // true
// Dog 有 type 属性且值为 'dog'，所以兼容

type ObjectCheck2 = Cat extends { type: 'dog' } ? true : false  // false
// Cat 的 type 是 'cat'，不兼容 {type: 'dog'}


// 原始类型：检查值相等性
type PrimitiveCheck = 'dog' extends 'dog' ? true : false  // true
type PrimitiveCheck2 = 'cat' extends 'dog' ? true : false  // false


// ============================================
// 4. 非分布式对比（使用元组包装）
// ============================================

// 阻止分布式行为
type NonDistributive<U, T> = [U] extends [{ type: T }] ? U : never

type Test1 = NonDistributive<Animal, 'dog'>  // never
// 因为 [Cat | Dog] 整体不能 extends [{type: 'dog'}]

type Test2 = LookUp<Animal, 'dog'>  // Dog
// 分布式版本可以正确工作


// ============================================
// 5. 更复杂的例子
// ============================================

// 对象类型：可以检查嵌套属性
type DeepLookUp<U, K extends string, V> = U extends { [P in K]: V } ? U : never

type FindByColor = DeepLookUp<Animal, 'color', 'brown'>  // Dog
// Cat 没有 color 属性，所以被过滤掉


// 原始类型：可以用于字符串操作
type StringFilter<U extends string, Prefix extends string> = 
  U extends `${Prefix}${string}` ? U : never

type Prefixed = StringFilter<'catFood' | 'dogFood' | 'bird', 'cat'>  // 'catFood'


// ============================================
// 6. 实际应用场景对比
// ============================================

// 场景1：从联合对象中筛选（对象类型）
type Event = 
  | { type: 'click', x: number, y: number }
  | { type: 'keypress', key: string }
  | { type: 'scroll', delta: number }

type ClickEvent = LookUp<Event, 'click'>
// { type: 'click', x: number, y: number }


// 场景2：从字符串联合中筛选（原始类型）
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

type SafeMethods = FilterType<HttpMethod, 'GET'>  // 'GET'
type UnsafeMethods = Exclude<HttpMethod, 'GET'>   // 'POST' | 'PUT' | 'DELETE' | 'PATCH'


// ============================================
// 总结
// ============================================

/*
原始类型 vs 对象类型在 extends 中的区别：

1. **原始类型**（如 string, number, 字面量）：
   - extends 检查的是**值的相等性或子类型关系**
   - 'dog' extends 'dog' → true
   - 'cat' extends 'dog' → false
   - string extends 'dog' → false
   - 'dog' extends string → true

2. **对象类型**：
   - extends 检查的是**结构兼容性（structural typing）**
   - {type: 'dog', color: 'brown'} extends {type: 'dog'} → true
   - {type: 'cat'} extends {type: 'dog'} → false
   - 只要右边要求的属性在左边都存在且类型兼容，就返回 true

3. **在联合类型中**：
   - 两者都会触发分布式条件类型
   - 但检查的逻辑不同：原始类型比较值，对象类型比较结构

4. **实际使用**：
   - 对象类型：适合根据属性筛选复杂对象
   - 原始类型：适合筛选字符串、数字等简单值
*/
