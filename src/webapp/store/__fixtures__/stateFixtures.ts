import { AnyAction } from "redux";
import createRootReducer from "../reducers";
import { State } from "../types";

const INIT = { type: "@@INIT" };

/** The store state after the actions, built with the app's reducers. */
export function createStateAfter(actions: ReadonlyArray<AnyAction>): State {
    const reducer = createRootReducer();
    return actions.reduce((state, action) => reducer(state, action), reducer(undefined, INIT));
}
