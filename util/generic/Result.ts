/* eslint-disable @typescript-eslint/no-use-before-define */

const RESULT_HOLE: unknown = Symbol('RESULT_HOLE');

enum ResultType {
    Okay,
    Err,
}

export class ResultExpectError extends Error {}

export const expect = <T extends boolean>(test: T, message?: string) => {
    if (test) return;
    throw new ResultExpectError(message);
};

export class Result<T, E> {
    private constructor(
        private __kind: ResultType,
        private __value: T,
        private __error: E,
    ) {}

    static Okay<T, E>(value: T): Result<T, E> {
        return new Result(ResultType.Okay, value, RESULT_HOLE as E);
    }

    static Err<T, E>(error: E): Result<T, E> {
        return new Result(ResultType.Err, RESULT_HOLE as T, error);
    }

    public static fromTry<T, E>(fn: () => T): Result<T, E> {
        try {
            return Okay(fn());
        } catch (e) {
            return Err(e);
        }
    }

    public static async fromTryAsync<T, E>(
        fn: () => Promise<T>,
    ): Promise<Result<T, E>> {
        try {
            return Okay(await fn());
        } catch (e) {
            return Err(e);
        }
    }

    public isOkay() {
        return this.__kind === ResultType.Okay;
    }

    public isErr() {
        return this.__kind === ResultType.Err;
    }

    public expect(message?: string) {
        if (this.isOkay()) return this.__value;
        throw new ResultExpectError(message);
    }

    public unwrapOr(or: T) {
        if (this.isOkay()) return this.__value;
        return or;
    }

    public map<R>(fn: (t: T) => R): Result<R, E> {
        if (this.isOkay()) return Okay(fn(this.__value));
        return Err(this.__error);
    }
}

export const Okay = Result.Okay;
export const Err = Result.Err;
