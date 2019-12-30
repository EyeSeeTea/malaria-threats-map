import { ActionsObservable, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { of } from "rxjs";
import { switchMap, withLatestFrom } from "rxjs/operators";
import {
  logEventAction,
  setBoundsAction,
  setCountryModeAction,
  setRegionAction,
  setSelection,
  setStoryModeAction,
  setStoryModeStepAction,
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
        logEventAction({ category: "theme", action: action.payload }),
        setSelection(null),
        setStoryModeStepAction(0)
      ];
      switch (action.payload) {
        case "invasive":
          return of(...[setCountryModeAction(false), ...base]);
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
      return of();
    })
  );

export const setStoryModeStepEpic = (
  action$: ActionsObservable<
    ActionType<
      | typeof setStoryModeStepAction
      | typeof setStoryModeAction
      | typeof setThemeAction
    >
  >,
  state$: StateObservable<State>
) =>
  action$
    .ofType(
      ActionTypeEnum.MalariaSetStoryModeStep,
      ActionTypeEnum.MalariaSetStoryMode,
      ActionTypeEnum.MalariaSetTheme
    )
    .pipe(
      withLatestFrom(state$),
      switchMap(([action, state]) => {
        const theme = state.malaria.theme;
        if (!state.malaria.storyMode) {
          return of();
        }
        switch (theme) {
          case "prevention":
            switch (action.payload) {
              case 0:
                return of(setCountryModeAction(true), setRegionAction({}));
              case 1:
                return of(setCountryModeAction(false), setRegionAction({}));
              case 2:
                return of(
                  setCountryModeAction(false),
                  setRegionAction({ region: "SOUTH-EAST_ASIA" })
                );
              case 3:
                return of(
                  setCountryModeAction(false),
                  setRegionAction({ region: "AFRICA" })
                );
              default:
                return of();
            }
          case "diagnosis":
            switch (action.payload) {
              case 0:
                return of(
                  setCountryModeAction(false),
                  setRegionAction({ country: "PERU" })
                );
              case 1:
                return of(
                  setCountryModeAction(false),
                  setRegionAction({ region: "AFRICA" })
                );
              case 2:
                return of(setCountryModeAction(true), setRegionAction({}));
              default:
                return of();
            }
          case "treatment":
            switch (action.payload) {
              case 0:
                return of(setCountryModeAction(true), setRegionAction({}));
              case 1:
                return of(setCountryModeAction(true), setRegionAction({}));
              case 2:
                return of(setCountryModeAction(true), setRegionAction({}));
              case 3:
                return of(setCountryModeAction(false), setRegionAction({}));
              default:
                return of();
            }
          case "invasive":
            switch (action.payload) {
              case 0:
                return of(
                  setCountryModeAction(false),
                  setRegionAction({}),
                  setBoundsAction([
                    [23.73159810368128, -5.628262912580524],
                    [57.46049921128645, 22.484559914680688]
                  ])
                );
              case 1:
                return of(
                  setCountryModeAction(false),
                  setRegionAction({ country: "PAKISTAN" })
                );
              case 2:
                return of(setCountryModeAction(false));
              default:
                return of();
            }
          default:
            return of();
        }
      })
    );
