import { isArray } from 'lodash'

export default class Monad<T> {

  constructor(
    public readonly value: T | T[] | null
  ) {}

  public asArray() {
    if (this.value == null) {
      return []
    } else if (isArray(this.value)) {
      return this.value
    } else {
      return [this.value]
    }
  }

  public map<R>(transform: (value: T) => R): Monad<R> {
    if (this.value == null) {
      return new Monad<R>(null)
    } else if (isArray(this.value)) {
      return new Monad(this.value.map(transform))
    } else {
      return new Monad(transform(this.value))
    }
  }

  public flatMap<R>(transform: (value: T) => R | R[] | null): Monad<R> {
    if (this.value == null) {
      return new Monad<R>(null)
    } else if (!isArray(this.value)) {
      return new Monad(transform(this.value))
    }

    const newValues: R[] = []
    for (const value of this) {
      const transformed = transform(value)
      if (transformed == null) { continue }

      if (isArray(transformed)) {
        newValues.push(...transformed)
      } else {
        newValues.push(transformed)
      }
    }

    return new Monad<R>(newValues)
  }

  public mapReduce<R>(map: (value: T) => R, reduce: (results: R[]) => R, valueForNull: R) {
    if (this.value == null) {
      return valueForNull
    } else if (isArray(this.value)) {
      return reduce(this.value.map(map))
    } else {
      return map(this.value)
    }
  }

  public [Symbol.iterator](): IterableIterator<T> {
    return this.asArray()[Symbol.iterator]()
  }

}