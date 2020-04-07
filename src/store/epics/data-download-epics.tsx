import { ActionsObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { mergeMap, switchMap } from "rxjs/operators";
import * as ajax from "../ajax";
import { of } from "rxjs";
import {
  addDataDownloadRequestAction,
  fetchDataDownloadRequestAction
} from "../actions/data-download-actions";
import config from "../../config";

export const getDataDownloadEntriesEpic = (
  action$: ActionsObservable<ActionType<typeof fetchDataDownloadRequestAction>>
) =>
  action$.ofType(ActionTypeEnum.FetchDownloadsRequest).pipe(
    switchMap(() => {
      return ajax.getFull(config.backendUrl).pipe(
        mergeMap((response: Response) => {
          return of();
        })
      );
    })
  );

export const createDataDownloadEntryEpic = (
  action$: ActionsObservable<ActionType<typeof addDataDownloadRequestAction>>
) =>
  action$.ofType(ActionTypeEnum.AddDownloadRequest).pipe(
    switchMap(action => {
      return ajax.postFull(config.backendUrl, action.payload).pipe(
        // return ajax.getFull(`https://portal-uat.who.int/malthreats-api/`).pipe(
        mergeMap((response: any) => {
          return of();
        })
      );
    })
  );
