import { Future } from "../../../common/Future";
import { Observable, Subscriber } from "rxjs"

export function fromFuture<Error, Data>(future: Future<Error, Data>): Observable<Data> {
    return new Observable((subscriber: Subscriber<Data>) => {
        const cancel = future.run(
            data => {
                subscriber.next(data);
                subscriber.complete();
            },
            error => {
                subscriber.error(error);
            }
        )

        return () => cancel();
    });
}