import { ActionType } from "typesafe-actions";
import { catchError, mergeMap, switchMap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { addDataDownloadRequestAction } from "../actions/data-download-actions";
import { ofType, StateObservable } from "redux-observable";
import { ActionTypeEnum } from "../actions";
import { State } from "history";
import { EpicDependencies } from "..";
import { fromFuture } from "./utils";
import { addNotificationAction } from "../actions/notifier-actions";

export const createDataDownloadEntryEpic = (
    action$: Observable<ActionType<typeof addDataDownloadRequestAction>>,
    _state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.AddDownloadRequest),
        switchMap(action => {
            return fromFuture(compositionRoot.downloads.send(action.payload)).pipe(
                mergeMap(() => {
                    return of();
                }),
                catchError((error: Error) => of(addNotificationAction(error.message)))
            );
        })
    );
