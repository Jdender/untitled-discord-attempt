import { NowRequest, NowResponse } from '@now/node';
import { ResultExpectError } from './generic/Result';

export type RequestHandler = (req: NowRequest, res: NowResponse) => void;

export const handleResult = (
    code: number,
    handle: RequestHandler,
): RequestHandler => (req, res) => {
    try {
        return handle(req, res);
    } catch (e) {
        if (!(e instanceof ResultExpectError)) throw e;
        res.status(code).send(e.message);
        res.end();
    }
};
