import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { Contact, Download } from "../../components/DataDownload";

export const fetchDataDownloadRequestAction = createAction(ActionTypeEnum.FetchDownloadsRequest)();

export const addDataDownloadRequestAction = createAction(ActionTypeEnum.AddDownloadRequest)<Download>();

export const addSubscriptionContactRequestAction = createAction(
    ActionTypeEnum.AddSubscriptionContactRequest
)<Contact>();

export const addSubscriptionContactSuccessAction = createAction(ActionTypeEnum.AddSubscriptionContactSuccess)();

export const addSubscriptionContactErrorAction = createAction(ActionTypeEnum.AddSubscriptionContactError)();
