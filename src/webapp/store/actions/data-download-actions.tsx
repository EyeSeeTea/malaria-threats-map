import { createAction } from "typesafe-actions";
import { Download } from "../../components/DataDownload/types";
import { ActionTypeEnum } from "../actions";

export const fetchDataDownloadRequestAction = createAction(ActionTypeEnum.FetchDownloadsRequest)();

export const addDataDownloadRequestAction = createAction(ActionTypeEnum.AddDownloadRequest)<Download>();
