declare function PromiseAll<T extends any[]>(values: [...T]): Promise<{
  [K in keyof T]: Awaited<T[K]>
}>
