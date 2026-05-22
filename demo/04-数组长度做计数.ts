// BuildArray: 构建指定长度的数组
// type BuildArray<
//   Length extends number, 
//   Ele = unknown, 
//   Arr extends unknown[] = []
// > = Arr['length'] extends Length 
//   ? Arr 
//   : BuildArray<Length, Ele, [...Arr, Ele]>;

// Add: 加法 = 两个数组合并后的长度
type Add<Num1 extends number, Num2 extends number> = [...BuildArray<Num1>, ...BuildArray<Num2>]['length']
type AddTest = Add<2, 3>  // 5

// Subtract: 减法 = 从Num1数组中"切掉"Num2长度后剩余的长度

// 写法1：带命名标签（更易读）
type MSubtract<Num1 extends number, Num2 extends number> =
  BuildArray<Num1> extends [...arr1: BuildArray<Num2>, ...arr2: infer Rest]
  ? Rest['length']
  : never;

// 写法2：不带命名标签（更简洁）
type MSubtract2<Num1 extends number, Num2 extends number> =
  BuildArray<Num1> extends [...BuildArray<Num2>, ...infer Rest]
  ? Rest['length']
  : never;

type SubtractTest = MSubtract<5, 4>   // 1
type SubtractTest2 = MSubtract2<5, 4>  // 1 (结果相同)
type SubtractTest3 = MSubtract<10, 3>  // 7
type SubtractTest4 = MSubtract2<10, 3> // 7 (结果相同)

// Mutiply
// Multiply: 乘法 = 把Num1加Num2次
type MMutiply<
  Num1 extends number,              // 被乘数
  Num2 extends number,              // 乘数（计数器）
  ResultArr extends unknown[] = []  // 累加器
> = Num2 extends 0
  ? ResultArr['length']             // 递归出口：返回累加结果
  : MMutiply<
    Num1,
    MSubtract<Num2, 1> extends number ? MSubtract<Num2, 1> : never,
    [...BuildArray<Num1>, ...ResultArr]
  >;

type MultiplyTest1 = MMutiply<3, 4>;   // 12
type MultiplyTest2 = MMutiply<5, 6>;   // 30
type MultiplyTest3 = MMutiply<0, 10>;  // 0
type MultiplyTest4 = MMutiply<7, 0>;   // 0
type MultiplyTest5 = MMutiply<1, 8>;   // 8

// Divide: 除法 = 看能减多少次
type MDivide<
  Num1 extends number,              // 被除数
  Num2 extends number,              // 除数
  CountArr extends unknown[] = []   // 计数器
> =
  Num1 extends 0
  ? CountArr['length']            // 递归出口：返回减的次数
  : MDivide<
    MSubtract<Num1, Num2> extends number ? MSubtract<Num1, Num2> : never,
    Num2,
    [unknown, ...CountArr]
  >;

type DivideTest1 = MDivide<12, 3>;  // 4
type DivideTest2 = MDivide<20, 5>;  // 4
type DivideTest3 = MDivide<10, 2>;  // 5
type DivideTest4 = MDivide<15, 3>;  // 5
type DivideTest5 = MDivide<0, 5>;   // 0

// 数组长度实现计数
// StrLen
type MStrLen<Str extends string, CountArr extends unknown[] = []> =
  Str extends `${string}${infer Rest}` ? MStrLen<Rest, [...CountArr, unknown]> : CountArr['length']
type MStrLenTest = MStrLen<'abc'>

// GreaterThan
// GreaterThan: 比较大小（用计数器"赛跑"）
type MGreaterThan<
  Num1 extends number,
  Num2 extends number,
  CountArr extends unknown[] = []
> =
  Num1 extends Num2                        // 相等？
    ? false                                // 不大于
    : (
        CountArr['length'] extends Num2    // 先追上Num2？
          ? true                           // Num1 > Num2
          : CountArr['length'] extends Num1  // 先追上Num1？
            ? false                        // Num1 < Num2
            : MGreaterThan<Num1, Num2, [...CountArr, unknown]>  // 继续递增
      );

type GreaterThanTest1 = MGreaterThan<5, 3>;   // true
type GreaterThanTest2 = MGreaterThan<3, 5>;   // false
type GreaterThanTest3 = MGreaterThan<3, 3>;   // false
type GreaterThanTest4 = MGreaterThan<10, 8>;  // true
type GreaterThanTest5 = MGreaterThan<0, 1>;   // false

// Fibonacci
// Fibonacci: 斐波那契数列
type MFibonacciFun<
  PrevArr extends unknown[],      // 前一个数 F(n-1)
  CurrentArr extends unknown[],   // 当前数 F(n)
  IndexArr extends unknown[] = [], // 计数器
  Num extends number = 1          // 目标项数
> = 
  IndexArr['length'] extends Num  // 到达目标项？
    ? CurrentArr['length']        // 返回当前数
    : MFibonacciFun<
        CurrentArr,                     // Prev = Current
        [...PrevArr, ...CurrentArr],    // Current = Prev + Current
        [...IndexArr, unknown],         // Index++
        Num
      >;

type MFibonacci<Num extends number> = MFibonacciFun<[1], [], [], Num>;

type FibTest1 = MFibonacci<1>;   // 1
type FibTest2 = MFibonacci<2>;   // 1
type FibTest3 = MFibonacci<3>;   // 2
type FibTest4 = MFibonacci<4>;   // 3
type FibTest5 = MFibonacci<5>;   // 5
type FibTest6 = MFibonacci<6>;   // 8
type FibTest7 = MFibonacci<7>;   // 13
type FibTest8 = MFibonacci<8>;   // 21
type MFibonacciTest = MFibonacci<8>