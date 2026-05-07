import type { Equal, Expect } from "@type-challenges/utils";
export type Includes<T extends any[], U> = T extends [
  infer First,
  ...infer Rest,
]
  ? Equal<First, U> extends true
    ? First
    : Includes<Rest, U>
  : false;

// function Includes(list, key) {
//   for(let item of list) {
//     if (item === key) return true
//   }
//   return false;
// }

function Includes(list, key) {
  function _(list, key) {
    if (list.length === 0) return false;
    const [first, ...rest] = list;
    if (first === key) {
      return true;
    } else {
      _(rest, key);
    }
  }
  _(list, key);
}
