import { Future } from "../../common/Future";

type Error = { message: string };

export type FutureData<Data> = Future<Error, Data>;
