
import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import {  DownloadState, State } from "../types";
import { Download } from "../../components/DataDownload";

const initialDownload = {
    firstName: "",
    lastName: "",
    organizationType: "",
    organizationName: "",
    position: "",
    country: "",
    email: "",
    phoneNumber: "",
    uses: "",
    date: "",
    researchInfo: "",
    policiesInfo: "",
    contactConsent: false,
    organisationProjectConsent: false,
    toolsInfo: "",
    implementationCountries: "",
    theme: "",
    dataset: "" 
};
const initialState: DownloadState = Object.freeze({
    download: initialDownload,
    loading: false,
    error: "",
});

export default createReducer<DownloadState>(initialState, {
    [ActionTypeEnum.AddDownloadRequest]: (download: Download) => (state) => ({
        ...state,
        download,
        loading: true,
    }),
    [ActionTypeEnum.AddDownloadSuccess]: () => R.assoc("loading", false),
    [ActionTypeEnum.AddDownloadError]: () => state => ({
        ...state,
        error: "There was a problem adding the download",
        loading: false,
    }),
});
const selectDownloadState = (state: State) => state.downloads;
export const selectDownloadLoading = createSelector(selectDownloadState, R.prop("loading"));
