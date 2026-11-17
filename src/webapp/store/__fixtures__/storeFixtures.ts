import { AnyAction, applyMiddleware, createStore, Store } from "redux";
import { createEpicMiddleware } from "redux-observable";
import rootEpic from "../epics";
import createRootReducer from "../reducers";
import { setInsecticideClass, setInsecticideTypes, setSpecies, setType } from "../actions/prevention-actions";
import { defaultInsecticideClass } from "../../../domain/entities/InsecticideClass";
import { State } from "../types";

// What the URL sync dispatches when the map opens without filters in the URL. Each epic of the filter
// chain skips the first action of its type, so a store must start from here, as the app does.
const mapOpened: ReadonlyArray<AnyAction> = [
    setInsecticideClass(defaultInsecticideClass),
    setInsecticideTypes(undefined),
    setType(undefined),
    setSpecies(undefined),
];

// The epics that load studies read the composition root from the dependencies when they start. The
// tests load the studies with success actions, so the epics never call it.
const noDependencies = {};

/**
 * A store with the app's reducers and every epic, after the map opened and then the actions. The only
 * place the specs set up redux and redux-observable.
 */
export function createTestStoreAfter(actions: ReadonlyArray<AnyAction>): Store<State> {
    const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction>({ dependencies: noDependencies });
    const store = createStore(createRootReducer(), applyMiddleware(epicMiddleware));
    epicMiddleware.run(rootEpic);
    [...mapOpened, ...actions].forEach(action => store.dispatch(action));
    return store;
}
