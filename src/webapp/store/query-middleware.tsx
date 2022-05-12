import { createBrowserHistory as createHistory } from "history";
import URLSearchParams from "@ungap/url-search-params";

function ReduxQuerySync({ store, params, replaceState, initialTruth, history = createHistory() }: any) {
    const { dispatch } = store;

    let ignoreLocationUpdate = false;
    let ignoreStateUpdate = false;
    let lastQueryValues: any;

    function getLocation(history: any) {
        if (Object.hasOwnProperty.call(history, "location")) {
            return history.location;
        } else if (Object.hasOwnProperty.call(history, "getCurrentLocation")) {
            return history.getCurrentLocation();
        }
    }

    function getQueryValues(location: any) {
        const locationParams = new URLSearchParams(location.search);
        const queryValues: any = {};
        Object.keys(params).forEach(param => {
            const { defaultValue, stringToValue = (s: any) => s } = params[param];
            const valueString = locationParams.get(param);
            queryValues[param] = valueString === null ? defaultValue : stringToValue(valueString);
        });
        return queryValues;
    }

    function handleLocationUpdate(location: any) {
        if (ignoreLocationUpdate) return;

        const state = store.getState();
        const queryValues = getQueryValues(location);
        const actionsToDispatch: any = [];

        Object.keys(queryValues).forEach(param => {
            const value = queryValues[param];
            if (lastQueryValues === undefined || lastQueryValues[param] !== value) {
                const { selector, action } = params[param];
                if (selector(state) !== value) {
                    actionsToDispatch.push(action(value));
                }
            }
        });

        lastQueryValues = queryValues;

        ignoreStateUpdate = true;
        actionsToDispatch.forEach((action: any) => {
            dispatch(action);
        });
        ignoreStateUpdate = false;
        handleStateUpdate({ replaceState: true });
    }

    function handleStateUpdate({ replaceState }: any) {
        if (ignoreStateUpdate) return;

        const state = store.getState();
        const location = getLocation(history);
        const locationParams = new URLSearchParams(location.search);

        Object.keys(params).forEach(param => {
            const { selector, defaultValue, valueToString = (v: any) => `${v}` } = params[param];
            const value = selector(state);
            if (value === defaultValue) {
                locationParams.delete(param);
            } else {
                locationParams.set(param, valueToString(value));
            }
            lastQueryValues[param] = value;
        });
        const newLocationSearchString = `?${locationParams}`;
        const oldLocationSearchString = location.search || "?";

        if (newLocationSearchString !== oldLocationSearchString) {
            ignoreLocationUpdate = true;
            const newLocation = {
                pathname: location.pathname,
                search: newLocationSearchString,
                hash: location.hash,
                state: location.state,
            };
            replaceState ? history.replace(newLocation) : history.push(newLocation);
            ignoreLocationUpdate = false;
        }
    }

    const unsubscribeFromLocation = history.listen(handleLocationUpdate);
    const unsubscribeFromStore = store.subscribe(() => handleStateUpdate({ replaceState }));

    if (initialTruth === "location") {
        handleLocationUpdate(getLocation(history));
    } else {
        lastQueryValues = getQueryValues(getLocation(history));
    }
    if (initialTruth === "store") {
        handleStateUpdate({ replaceState: true });
    }

    return function unsubscribe() {
        unsubscribeFromLocation();
        unsubscribeFromStore();
    };
}

ReduxQuerySync.enhancer = (config: any) => {
    return (storeCreator: any) => (reducer: any, initialState: any, enhancer: any) => {
        const store = storeCreator(reducer, initialState, enhancer);
        ReduxQuerySync({ store, ...config });
        return store;
    };
};

export default ReduxQuerySync;
