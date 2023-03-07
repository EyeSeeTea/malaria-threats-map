import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { Download } from "../../components/DataDownload/types";

export const addDataDownloadRequestAction = createAction(ActionTypeEnum.AddDownloadRequest)<Download>();
