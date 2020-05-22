/* eslint-disable @typescript-eslint/no-use-before-define */

export class ResultExpectError extends Error {}

export abstract class Result<T, E> {
    static Okay<T, E>(value: T): Result<T, E> {
        return Okay.Okay(value);
    }

    static Err<T, E>(error: E): Result<T, E> {
        return Err.Err(error);
    }

    public static fromTry<T, E>(fn: () => T): Result<T, E> {
        try {
            return this.Okay(fn());
        } catch (e) {
            return this.Err(e);
        }
    }

    public static async fromTryAsync<T, E>(
        fn: () => Promise<T>,
    ): Promise<Result<T, E>> {
        try {
            return this.Okay(await fn());
        } catch (e) {
            return this.Err(e);
        }
    }

    public isOkay(): this is Okay<T> {
        return this instanceof Okay;
    }

    public isErr(): this is Err<E> {
        return this instanceof Err;
    }

    public expect(message?: string) {
        if (this.isOkay()) return this.value;
        throw new ResultExpectError(message);
    }

    public unwrapOr(or: T) {
        if (this.isOkay()) return this.value;
        return or;
    }

    public map<R>(fn: (t: T) => R): Result<R, E> {
        if (this.isOkay()) return Result.Okay(fn(this.value));
        return (this as unknown) as Result<R, E>;
    }
}

class Okay<T> extends Result<T, never> {
    private constructor(public value: T) {
        super();
    }
    static Okay<T, E>(value: T): Result<T, E> {
        return new Okay(value);
    }
}

class Err<E> extends Result<never, E> {
    constructor(public value: E) {
        super();
    }
    static Err<T, E>(error: E): Result<T, E> {
        return new Err(error);
    }
}
