export class Identity<T> {
    private constructor(private __value: T) {}
    static I<T>(value: T) {
        return new Identity(value);
    }

    public unwrap(): T {
        return this.__value;
    }

    public map<R>(fn: (t: T) => R): Identity<R> {
        return Identity.I(fn(this.__value));
    }
}

export const I = Identity.I;
