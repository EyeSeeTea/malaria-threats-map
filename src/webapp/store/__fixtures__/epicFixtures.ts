import { firstValueFrom, from, Observable, Subject } from "rxjs";
import { toArray } from "rxjs/operators";
import { AnyAction } from "redux";
import { StateObservable } from "redux-observable";
import { State } from "../types";
import { createStateAfter } from "./stateFixtures";

type Epic<A extends AnyAction, Output> = (action$: Observable<A>, state$: StateObservable<State>) => Observable<Output>;

/**
 * Every action the epic emits for the actions it is given, reading a state fixed for the whole run:
 * by default the state the app's reducers start with. The only place the epic specs touch rxjs and
 * redux-observable.
 */
export function runEpic<A extends AnyAction, Output>(
    epic: Epic<A, Output>,
    actions: ReadonlyArray<A>,
    state: State = createStateAfter([])
): Promise<Output[]> {
    const state$ = new StateObservable(new Subject<State>(), state);
    return firstValueFrom(epic(from(actions), state$).pipe(toArray()));
}
