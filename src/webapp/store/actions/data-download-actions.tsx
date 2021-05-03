import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { Contact, Download } from "../../components/DataDownload";

export const fetchDataDownloadRequestAction = createAction(ActionTypeEnum.FetchDownloadsRequest, action => {
    return () => action();
});

export const addDataDownloadRequestAction = createAction(ActionTypeEnum.AddDownloadRequest, action => {
    return (download: Download) => action(download);
});

export const addSubscriptionContactRequestAction = createAction(
    ActionTypeEnum.AddSubscriptionContactRequest,
    action => {
        return (contact: Contact) => action(contact);
    }
);

export const addSubscriptionContactSuccessAction = createAction(
    ActionTypeEnum.AddSubscriptionContactSuccess,
    action => {
        return () => action();
    }
);

export const addSubscriptionContactErrorAction = createAction(ActionTypeEnum.AddSubscriptionContactError, action => {
    return () => action();
});
