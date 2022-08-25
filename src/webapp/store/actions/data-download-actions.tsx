import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { Download } from "../../components/DataDownload";

export const fetchDataDownloadRequestAction = createAction(ActionTypeEnum.FetchDownloadsRequest)();

export const addDataDownloadRequestAction = createAction(ActionTypeEnum.AddDownloadRequest)<Download>();
