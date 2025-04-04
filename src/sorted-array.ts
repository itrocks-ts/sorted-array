
abstract class ASortedArray<T> extends Array<T>
{
	public distinct = false

	constructor(...items: T[])
	{
		super(...items)
		Object.defineProperty(
			this, 'distinct', { configurable: true, enumerable: false, value: this.distinct, writable: true }
		)
	}

	abstract insert(item: T): number | undefined

	abstract isSorted(): boolean

	push(...items: T[]): number
	{
		for (const item of items)
			this.insert(item)
		return this.length
	}

}

export class SortedArray<T> extends ASortedArray<T>
{

	#leftOf(element: T)
	{
		let left = 0
		let middle: number
		let right = this.length
		while (left < right) {
			middle = ((left + right) >>> 1)
			if (this[middle] < element)
				left = middle + 1
			else
				right = middle
		}
		return left
	}

	includes(searchElement: T)
	{
		const left = this.#leftOf(searchElement)
		return this[left] === searchElement
	}

	indexOf(searchElement: T)
	{
		const left = this.#leftOf(searchElement)
		return (this[left] === searchElement) ? left : -1
	}

	insert(item: T)
	{
		const left = this.#leftOf(item)
		if (this.distinct && (this[left] === item)) {
			return
		}
		this.splice(left, 0, item)
		return left
	}

	isSorted()
	{
		const length = this.length
		for (let index = 1; index < length; index ++) {
			if (this[index] < this[index - 1]) return false
		}
		return true
	}

}

export class SortedArrayBy<T extends { [index: number | string]: any }> extends ASortedArray<T>
{

	constructor(public compareBy: number | string, ...items: T[])
	{
		super(...items)
	}

	#leftOf(element: T)
	{
		const compareKey = this.compareBy
		let left = 0
		let middle: number
		let right = this.length
		while (left < right) {
			middle = ((left + right) >>> 1)
			if (this[middle][compareKey] < element[compareKey])
				left = middle + 1
			else
				right = middle
		}
		return left
	}

	includes(searchElement: T)
	{
		const left = this.#leftOf(searchElement)
		return this[left] === searchElement
	}

	indexOf(searchElement: any)
	{
		const left = this.#leftOf(searchElement)
		return (this[left] === searchElement) ? left : -1
	}

	insert(item: any)
	{
		const left = this.#leftOf(item)
		if (this.distinct && (this[left] === item)) {
			return
		}
		this.splice(left, 0, item)
		return left
	}

	isSorted()
	{
		const compareBy = this.compareBy
		const length = this.length
		for (let index = 1; index < length; index ++) {
			if (this[index][compareBy] < this[index - 1][compareBy]) return false
		}
		return true
	}

	sort(compareFn: (a: T, b: T) => number): this
	{
		return super.sort(compareFn ?? ((a: T, b: T): number => {
			if (a[this.compareBy] > b[this.compareBy]) return 1
			return (a[this.compareBy] < b[this.compareBy]) ? -1 : 0
		}))
	}

}

export class SortedArrayCompareFn<T> extends ASortedArray<T>
{

	constructor(public compareFn: (a: T, b: T) => number, ...items: T[])
	{
		super(...items)
	}

	#leftOf(element: T)
	{
		let left = 0
		let middle: number
		let right = this.length
		while (left < right) {
			middle = ((left + right) >>> 1)
			if (this.compareFn(this[middle], element) < 0)
				left = middle + 1
			else
				right = middle
		}
		return left
	}

	includes(searchElement: T)
	{
		const left = this.#leftOf(searchElement)
		return !this.compareFn(this[left], searchElement)
	}

	indexOf(searchElement: T)
	{
		const left = this.#leftOf(searchElement)
		return this.compareFn(this[left], searchElement) ? -1 : left
	}

	insert(insert: T)
	{
		const left = this.#leftOf(insert)
		if (this.distinct && (this[left] === insert)) {
			return
		}
		this.splice(left, 0, insert)
		return left
	}

	isSorted()
	{
		const length = this.length
		for (let index = 1; index < length; index ++) {
			if (this.compareFn(this[index], this[index - 1]) < 0) return false
		}
		return true
	}

	sort(compareFn: (a: T, b: T) => number): this
	{
		return super.sort(compareFn ?? this.compareFn)
	}

}
