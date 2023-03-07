import { ActionType } from "typesafe-actions";
import { mergeMap, switchMap } from "rxjs/operators";
import * as ajax from "../ajax";
import { Observable, of } from "rxjs";
import { addDataDownloadRequestAction } from "../actions/data-download-actions";
import config from "../../config";
import { ofType } from "redux-observable";
import { ActionTypeEnum } from "../actions";

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
