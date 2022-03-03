import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { Download } from "../../components/DataDownload";

export const fetchDataDownloadRequestAction = createAction(ActionTypeEnum.FetchDownloadsRequest, action => {
    return () => action();
});

export const addDataDownloadRequestAction = createAction(ActionTypeEnum.AddDownloadRequest, action => {
    return (download: Download) => action(download);
});
