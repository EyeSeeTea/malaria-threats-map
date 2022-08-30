import { ActionType } from "typesafe-actions";
import { mergeMap, switchMap } from "rxjs/operators";
import * as ajax from "../ajax";
import { Observable, of } from "rxjs";
import { addDataDownloadRequestAction, fetchDataDownloadRequestAction } from "../actions/data-download-actions";
import config from "../../config";
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
