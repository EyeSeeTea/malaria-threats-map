import { ActionType } from "typesafe-actions";
import { catchError, mergeMap, switchMap } from "rxjs/operators";
import * as ajax from "../ajax";
import { Observable, of } from "rxjs";
import {
    addDataDownloadRequestAction,
    addSubscriptionContactErrorAction,
    addSubscriptionContactRequestAction,
    addSubscriptionContactSuccessAction,
    fetchDataDownloadRequestAction,
} from "../actions/data-download-actions";
import config from "../../config";
import { AjaxError } from "rxjs/ajax";
import { addNotificationAction } from "../actions/notifier-actions";
import { setSubscriptionOpenAction } from "../actions/base-actions";
import { ofType } from "redux-observable";
import { ActionTypeEnum } from "../actions";

export const getDataDownloadEntriesEpic = (action$: Observable<ActionType<typeof fetchDataDownloadRequestAction>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchDownloadsRequest),
        switchMap(() => {
            return ajax.getFull<Response>(config.backendUrl).pipe(
                mergeMap((_response: Response) => {
                    return of();
                })
            );
        })
    );

export const createDataDownloadEntryEpic = (action$: Observable<ActionType<typeof addDataDownloadRequestAction>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.AddDownloadRequest),
        switchMap(action => {
            return ajax.postFull(config.backendUrl, action.payload).pipe(
                mergeMap((_response: any) => {
                    return of();
                })
            );
        })
    );

export const createSubscriptionContact = (
    action$: Observable<ActionType<typeof addSubscriptionContactRequestAction>>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.AddSubscriptionContactRequest),
        switchMap(action => {
            return ajax.patchFull(config.backendUrl, action.payload).pipe(
                mergeMap((response: any) => {
                    if (response.notices) {
                        return of(
                            addNotificationAction(response.notices.join(", ")),
                            setSubscriptionOpenAction(false),
                            addSubscriptionContactSuccessAction()
                        );
                    } else {
                        return of(
                            addNotificationAction("User successfully subscribed!"),
                            setSubscriptionOpenAction(false),
                            addSubscriptionContactSuccessAction()
                        );
                    }
                }),
                catchError((_error: AjaxError) => {
                    return of(
                        addNotificationAction("There was an error while trying to subscribe"),
                        addSubscriptionContactErrorAction()
                    );
                })
            );
        })
    );
