import {createEpicMiddleware} from "redux-observable";
import {applyMiddleware, compose, createStore} from "redux";

import rootEpic from "./epics";
import createRootReducer from "./reducers";
import {CompositionRoot} from "../../CompositionRoot";

export type EpicDependencies = {
    compositionRoot: CompositionRoot;
};

const dependencies = {
    compositionRoot: new CompositionRoot(),
};

const epicMiddleware = createEpicMiddleware({dependencies});

const middleware = [epicMiddleware];

export default function configureStore() {
    const composeEnhancer: typeof compose =
        (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(createRootReducer(), composeEnhancer(applyMiddleware(...middleware)));
    epicMiddleware.run(rootEpic as any);
    return {store};
}
