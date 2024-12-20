[![npm version](https://img.shields.io/npm/v/@itrocks/sorted-array?logo=npm)](https://www.npmjs.org/package/@itrocks/sorted-array)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/sorted-array)](https://www.npmjs.org/package/@itrocks/sorted-array)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/sorted-array?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/sorted-array)
[![issues](https://img.shields.io/github/issues/itrocks-ts/sorted-array)](https://github.com/itrocks-ts/sorted-array/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://25.re/ditr)

# sorted-array

[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) subclasses that remain
continuously sorted on [insert()](#insert) or [push()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/push) calls,
featuring optimized [includes()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
and [indexOf()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf).

This design makes inserting or pushing elements slower but accelerates searches,
without the overhead of using a [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)
or a [Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set).

Sorting can be based on:
- the item's value,
- a specific property of an object item,
- a custom comparison function.

## Compatibility

Isomorphic, load-anywhere, and typescript typed:
- Written in Typescript; the types declaration files are included in this package,
- Can be required or imported in any CommonJS or ES6 script running in node.js or your browser.

## Usage

### Installation

```bash
npm i @itrocks/sorted-array
```

### Examples

#### Sorting by Item Value

```js
import { SortedArray } from '@itrocks/sorted-array'

const array = new SortedArray(4, 10, 12)
array.push(7)

//> [4, 7, 10, 12]
```

See [SortedArray](#SortedArray) for more information.

#### Sorting by Object Property Value

```js
import { SortedArrayBy } from '@itrocks/sorted-array'

const array = new SortedArrayBy('name',
	{ age: 10, name: 'Paul' },
	{ age: 4,  name: 'Robert' },
	{ age: 12, name: 'William' }
)
array.push({ age: 7, name: 'Philip' })

/*> [
{ age: 10, name: 'Paul' },
{ age: 7,  name: 'Philip' },
{ age: 4,  name: 'Robert' },
{ age: 12, name: 'William' }
] */
```

See [SortedArrayBy](#SortedArrayBy) for more information.

#### Sorting with a Custom Comparison Function

```js
import { SortedArrayCompareFn } from '@itrocks/sorted-array'

const array = new SortedArrayCompareFn((a, b) => (a.open + a.close) - (b.open + b.close),
	{ open: 0, close: 4  },
	{ open: 3, close: 47 },
	{ open: 4, close: 80 }
)
array.push({ open: 2, close: 50 })
/*>[
{ open: 0, close: 4  },
{ open: 3, close: 47 },
{ open: 2, close: 50 },
{ open: 4, close: 80 }
] */
```

See [SortedArrayCompareFn](#SortedArrayCompareFn) for more information.

### When does It Sort?

Sorting occurs on each call to [insert()](#insert)
or [push()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/push).

### When does It NOT Sort?

If elements are passed as arguments to the constructor,
they are expected to be pre-sorted and won’t be sorted again.
This allows for faster storage and retrieval of pre-sorted arrays.

If you're unsure whether your source data is sorted,
you can call [sort()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
to apply sorting.

#### Example

```js
import { SortedArray } from '@itrocks/sorted-array'

const array = new SortedArray('Rupert', 'Mary', 'Francesca')
//> ['Rupert', 'Mary', 'Francesca']
array.sort()
//> ['Francesca', 'Mary', 'Rupert']
```

Both [SortedArrayBy](#SortedArrayBy) and [SortedArrayCompareFn](#SortedArrayCompareFn) behave similarly.

## API

### Classes

These classes extend the standard JavaScript 
[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) class
to provide continuous sorting and fast search capabilities:

#### SortedArray

This array continuously sorts by item value.

Refer to the [Common API](#common-api) for additional enhancements over the standard JavaScript
[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array) class.

#### SortedArrayBy

An array of objects continuously sorted by a specific property value,
or an array of arrays continuously sorted by a value at a specified index.

Additional property and methods: refer to the [Common API](#common-api).

##### SortedArrayBy() constructor

```js
new SortedArrayBy(compareBy)
new SortedArrayBy(compareBy, element1)
new SortedArrayBy(compareBy, element1, element2)
new SortedArrayBy(compareBy, element1, /* ..., */ elementN)
new SortedArrayBy(compareBy, arrayLength)
```

- If `compareBy` is a number, it specifies the index of each inner array's element that will be used for comparison.
  *Example:*
  ```js
  new SortedArrayBy(1, ['a', 'c', 'b'], ['r', 'd', 'a'])
  ```
  The array will be continuously sorted by the 2nd element of the array (index 1), comparing `'c'` and `'d'` in this example.
  <br/><br/>

- If `compareBy` is a number or a string, it specifies the property name by which object elements will be compared.
  *Example:*
  ```js
  new SortedArrayBy('name', { age: 30, name: 'Henry', age: 20, name: 'Johana' })
  ```
  The array will be continuously sorted by the value of the `name` property in each object element.
  <br/><br/>

- The `elements` and `arrayLength` parameters function the same as in the standard JavaScript
[Array constructor](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/Array).

#### SortedArrayCompareFn

An array of elements of any type, sorted continuously using a custom comparison function.

Additional property and methods: refer to the [Common API](#common-api).

##### SortedArrayCompareFn() constructor

```js
new SortedArrayCompareFn(compareFn)
new SortedArrayCompareFn(compareFn, element1)
new SortedArrayCompareFn(compareFn, element1, element2)
new SortedArrayCompareFn(compareFn, element1, /* ..., */ elementN)
new SortedArrayCompareFn(compareFn, arrayLength)
```

- The `compareFn` parameter must be provided as a comparison function, which will be used by the standard
[sort()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) method
if no specific comparaison function is passed as an argument.

- The `elements` and `arrayLength` parameters function the same as in the standard JavaScript
[Array constructor](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/Array).

### Common API

All standard methods and properties from the parent
[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)
class apply.

Notable behaviour changes:
- [push()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
will insert elements in sorted order rather than appending them at the end.
- [includes()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
and [indexOf()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
are optimized for a continously sorted array. They may not work as expected if:
	- elements passed to the constructor are unsorted,
	- a custom comparison function is used with [sort()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).

Additional property and methods include:

#### distinct

The `distinct` property of a `SortedArray` instance determine whether to ignore duplicates during insertion
with [insert()](#insert)
or [push()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/push).

Defaults to `false`. Set to `true` to prevent duplicate entries.

#### insert()

```js
insert(element)
```

Inserts an element into the array in sorted order.

Equivalent to
[push()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
with a single argument, but optimized for single-element insertion.

#### isSorted()

Scan the entire array to verify if it is sorted according to the SortedArray algorithm. 

Returns `true` if the array is sorted.

After calling
[sort()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
without arguments, `isSorted()` will always return `true`.

##### Example

This checks the array's order before sorting:

```js
import { SortedArray } from '@itrocks/sorted-array'

const array = new SortedArray('Rupert', 'Mary', 'Francesca')
//> ['Rupert', 'Mary', 'Francesca']
if (!array.isSorted())
	array.sort()
//> ['Francesca', 'Mary', 'Rupert']
```
