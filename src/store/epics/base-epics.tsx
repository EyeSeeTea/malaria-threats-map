import { ActionsObservable, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { of } from "rxjs";
import { switchMap, withLatestFrom } from "rxjs/operators";
import { setCountryModeAction, setThemeAction } from "../actions/base-actions";
import { PreventionMapType, State } from "../types";

export const setThemeEpic = (
  action$: ActionsObservable<ActionType<typeof setThemeAction>>,
  state$: StateObservable<State>
) =>
  action$.ofType(ActionTypeEnum.MalariaSetTheme).pipe(
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      switch (action.payload) {
        case "invasive":
          return of(setCountryModeAction(false));
        case "prevention":
          if (
            state.prevention.filters.mapType ===
            PreventionMapType.PBO_DEPLOYMENT
          ) {
            return of(setCountryModeAction(false));
          }
          return of();
        default:
          return of();
      }
    })
  );
