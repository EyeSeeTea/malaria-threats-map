import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { Contact } from "../../components/DataDownload";
import { Download } from "../../components/DataDownload/types";

export const fetchDataDownloadRequestAction = createAction(ActionTypeEnum.FetchDownloadsRequest)();

export const addDataDownloadRequestAction = createAction(ActionTypeEnum.AddDownloadRequest)<Download>();

export const addSubscriptionContactRequestAction = createAction(
    ActionTypeEnum.AddSubscriptionContactRequest
)<Contact>();

export const addSubscriptionContactSuccessAction = createAction(ActionTypeEnum.AddSubscriptionContactSuccess)();

export const addSubscriptionContactErrorAction = createAction(ActionTypeEnum.AddSubscriptionContactError)();
