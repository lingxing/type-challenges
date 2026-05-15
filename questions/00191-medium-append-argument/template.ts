type AppendArgument<Fn, A> = Fn extends (...Args: infer X) => infer R ? (...Args: [...X, A]) => R : never

type A191 = AppendArgument<(a: number, b: string) => number, boolean>
