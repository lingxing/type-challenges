type PreSpace = ' ' | '\n' | '\t'
type Trim<S extends string> =
  S extends `${PreSpace}${infer R}` | `${infer R}${PreSpace}` ? Trim<R> : S

type A108 = Trim<' str'>
