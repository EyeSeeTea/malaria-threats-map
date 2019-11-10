import { ActionsObservable, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { of } from "rxjs";
import { switchMap, withLatestFrom } from "rxjs/operators";
import {
  logEventAction,
  setCountryModeAction,
  setInitialDialogOpen,
  setThemeAction
} from "../actions/base-actions";
import { PreventionMapType, State } from "../types";
import ReactGA from "react-ga";

export const setThemeEpic = (
  action$: ActionsObservable<ActionType<typeof setThemeAction>>,
  state$: StateObservable<State>
) =>
  action$.ofType(ActionTypeEnum.MalariaSetTheme).pipe(
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const base = [
        logEventAction({ category: "theme", action: action.payload })
      ];
      switch (action.payload) {
        case "invasive":
        case "prevention":
          if (
            state.prevention.filters.mapType ===
            PreventionMapType.PBO_DEPLOYMENT
          ) {
            return of(...[setCountryModeAction(false), ...base]);
          }
          return of(...base);
        default:
          return of(...base);
      }
    })
  );

export const logEvent = (
  action$: ActionsObservable<ActionType<typeof logEventAction>>,
  state$: StateObservable<State>
) =>
  action$.ofType(ActionTypeEnum.MalariaLogEvent).pipe(
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      ReactGA.event(action.payload);
      return of(setInitialDialogOpen(false));
    })
  );
