import { Future } from "../../common/Future";

export type Error = { message: string };

export type FutureData<Data> = Future<Error, Data>;
