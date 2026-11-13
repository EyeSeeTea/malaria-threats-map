import { firstValueFrom, Observable, Subject } from "rxjs";
import { toArray } from "rxjs/operators";
import { AnyAction } from "redux";
import { StateObservable } from "redux-observable";
import { State } from "../types";

/** The state an epic reads, fixed for the whole test. */
export function createStateObservable(state: State): StateObservable<State> {
    return new StateObservable(new Subject<State>(), state);
}

/** Every action the epic emits for the actions it was given. */
export function collectActions(output$: Observable<AnyAction>): Promise<AnyAction[]> {
    return firstValueFrom(output$.pipe(toArray()));
}
