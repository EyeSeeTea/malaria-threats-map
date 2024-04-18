import { createAction } from "typesafe-actions";
import { Download } from "../../../domain/entities/Download";
import { ActionTypeEnum } from "../actions";

export const addDataDownloadRequestAction = createAction(ActionTypeEnum.AddDownloadRequest)<Download>();
