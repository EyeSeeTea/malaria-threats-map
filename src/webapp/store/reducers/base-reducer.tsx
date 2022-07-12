import * as R from "ramda";
import { createSelector } from "reselect";
import { ActionGroup, MalariaState, RegionState, SiteSelection, State } from "../types";
import { createReducer } from "../reducer-utils";
import { ActionTypeEnum } from "../actions";
import { SelectionData } from "../SelectionData";

const query = window.location.search.substring(1);

const isTourInitiallyOpen = localStorage.getItem("tour") !== "visited" && !query;

const initialState: MalariaState = Object.freeze({
    theme: "prevention",
    any: null,
    endemicity: false,
    countryMode: false,
    storyMode: false,
    storyModeStep: 0,
    filters: [2015, new Date().getFullYear()],
    region: {
        country: "",
        region: "",
        subRegion: "",
        site: "",
        siteIso2: "",
        siteCoordinates: undefined,
    },
    lastUpdatedDates: {
        prevention: null,
        diagnosis: null,
        treatment: null,
        invasive: null,
    },
    actionGroupSelected: null,
    filtersOpen: true,
    filtersMode: "filters",
    selection: null,
    hoverSelection: null,
    selectionData: null,
    mobileOptionsOpen: false,
    zoom: 2,
    setZoom: null,
    bounds: [[]],
    setBounds: [[]],
    tour: {
        open: isTourInitiallyOpen,
        step: 0,
    },
    dataDownloadOpen: false,
    reportOpen: false,
    mapTitle: "",
    subscriptionOpen: false,
    uploadFileOpen: false,
    feedbackOpen: false,
    theaterMode: false,
    legendExpanded: false,
    isSubmittingSubscription: false,
    isUploadingFile: false,
});

const getSelection = (state: MalariaState, selection: SiteSelection) => {
    const propsHasChanged = () =>
        state.selection?.SITE_ID !== selection.SITE_ID && state.selection?.coordinates !== selection.coordinates;

    return (state.selection === null && selection !== null) || selection == null || propsHasChanged()
        ? selection
        : state.selection;
};

export default createReducer<MalariaState>(initialState, {
    [ActionTypeEnum.MalariaSetTheme]: (theme: string) => R.assoc("theme", theme),
    [ActionTypeEnum.MalariaSetAny]: (any: any) => R.assoc("any", any),
    [ActionTypeEnum.MalariaSetRegion]: (region: RegionState | null) => (state: MalariaState) => ({
        ...state,
        region: region ? { ...initialState.region, ...region } : null,
    }),
    [ActionTypeEnum.MalariaSetFilters]: (filters: number[] | undefined) =>
        R.assoc("filters", filters || initialState.filters),
    [ActionTypeEnum.MalariaToogleEndemicityLayer]: (visible: boolean) => R.assoc("endemicity", visible),
    [ActionTypeEnum.MalariaSetStoryMode]: (storyMode: boolean) => R.assoc("storyMode", storyMode),
    [ActionTypeEnum.MalariaSetStoryModeStep]: (storyModeStep: number) => R.assoc("storyModeStep", storyModeStep || 0),
    [ActionTypeEnum.MalariaActionGroupSelected]: (value: ActionGroup | null) => R.assoc("actionGroupSelected", value),
    [ActionTypeEnum.SetSelection]: (selection: SiteSelection) => (state: MalariaState) => {
        return {
            ...state,
            selection: getSelection(state, selection),
        };
    },
    [ActionTypeEnum.SetHoverSelection]: (hoverSelection: SiteSelection) => (state: MalariaState) => {
        return {
            ...state,
            hoverSelection: getSelection(state, hoverSelection),
        };
    },
    [ActionTypeEnum.SetSelectionData]: (selectionData: SelectionData) => (state: MalariaState) => ({
        ...state,
        selectionData,
    }),
    [ActionTypeEnum.SetMobileOptionsOpen]: (mobileOptionsOpen: boolean) =>
        R.assoc("mobileOptionsOpen", mobileOptionsOpen),
    [ActionTypeEnum.UpdateZoom]: (zoom: number) => R.assoc("zoom", zoom),
    [ActionTypeEnum.SetZoom]: (zoom: number) => R.assoc("setZoom", zoom),
    [ActionTypeEnum.UpdateBounds]: (bounds: Array<Array<number>>) => R.assoc("bounds", bounds),
    [ActionTypeEnum.SetBounds]: (bounds: Array<Array<number>>) => R.assoc("setBounds", bounds),
    [ActionTypeEnum.SetTourOpen]: (open: boolean) => (state: MalariaState) => ({
        ...state,
        tour: { ...initialState.tour, open },
    }),
    [ActionTypeEnum.SetTourStep]: (step: number) => (state: MalariaState) => ({
        ...state,
        tour: { ...initialState.tour, step },
    }),
    [ActionTypeEnum.SetDataDownloadOpen]: (dataDownloadOpen: boolean) => R.assoc("dataDownloadOpen", dataDownloadOpen),
    [ActionTypeEnum.SetReportOpen]: (reportOpen: boolean) => R.assoc("reportOpen", reportOpen),
    [ActionTypeEnum.SetMapTitle]: (mapTitle: string) => R.assoc("mapTitle", mapTitle),
    [ActionTypeEnum.SetSubscriptionOpen]: (subscriptionOpen: boolean) => R.assoc("subscriptionOpen", subscriptionOpen),
    [ActionTypeEnum.SetUploadFileOpen]: (uploadFileOpen: boolean) => R.assoc("uploadFileOpen", uploadFileOpen),
    [ActionTypeEnum.SetFeedbackOpen]: (feedbackOpen: boolean) => R.assoc("feedbackOpen", feedbackOpen),
    [ActionTypeEnum.SetTheaterMode]: (theaterMode: boolean) => R.assoc("theaterMode", theaterMode),
    [ActionTypeEnum.SetLegendExpanded]: (legendExpanded: boolean) => R.assoc("legendExpanded", legendExpanded),
    [ActionTypeEnum.AddSubscriptionContactRequest]: () => R.assoc("isSubmittingSubscription", true),
    [ActionTypeEnum.AddSubscriptionContactError]: () => R.assoc("isSubmittingSubscription", false),
    [ActionTypeEnum.AddSubscriptionContactSuccess]: () => R.assoc("isSubmittingSubscription", false),
    [ActionTypeEnum.UploadFileRequest]: () => R.assoc("isUploadingFile", true),
    [ActionTypeEnum.UploadFileSuccess]: () => R.assoc("isUploadingFile", false),
    [ActionTypeEnum.UploadFileError]: () => R.assoc("isUploadingFile", false),
    [ActionTypeEnum.GetLastUpdatedSuccess]: (lastUpdatedDates: any) => R.assoc("lastUpdatedDates", lastUpdatedDates),
});

const selectMalariaState = (state: State) => state.malaria;

export const selectTheme = createSelector(selectMalariaState, state => state.theme);
export const selectStoryMode = createSelector(selectMalariaState, state => state.storyMode);
export const selectAny = createSelector(selectMalariaState, state => state.any);
export const selectEndemicity = createSelector(selectMalariaState, state => state.endemicity);
export const selectFilters = createSelector(selectMalariaState, state => state.filters);
export const selectRegion = createSelector(selectMalariaState, state => state.region);
export const selectActionGroupSelected = createSelector(selectMalariaState, state => state.actionGroupSelected);
export const selectStoryModeStep = createSelector(selectMalariaState, state => state.storyModeStep);
export const selectSelection = createSelector(selectMalariaState, state => state.selection);
export const selectHoverSelection = createSelector(selectMalariaState, state => state.hoverSelection);
export const selectAreMobileOptionsOpen = createSelector(selectMalariaState, state => state.mobileOptionsOpen);
export const selectSetZoom = createSelector(selectMalariaState, state => state.setZoom);
export const selectSetBounds = createSelector(selectMalariaState, state => state.setBounds);
export const selectTour = createSelector(selectMalariaState, state => state.tour);
export const selectIsDataDownloadOpen = createSelector(selectMalariaState, state => state.dataDownloadOpen);
export const selectIsReportOpen = createSelector(selectMalariaState, state => state.reportOpen);

export const selectMapTitle = createSelector(selectMalariaState, state => state.mapTitle);

export const selectIsSubscriptionOpen = createSelector(selectMalariaState, state => state.subscriptionOpen);

export const selectUploadFileOpen = createSelector(selectMalariaState, state => state.uploadFileOpen);

export const selectIsFeedbackOpen = createSelector(selectMalariaState, state => state.feedbackOpen);

export const selectTheaterMode = createSelector(selectMalariaState, state => state.theaterMode);

export const selectLegendExpanded = createSelector(selectMalariaState, state => state.legendExpanded);

export const selectIsSubmittingSubscription = createSelector(
    selectMalariaState,
    state => state.isSubmittingSubscription
);

export const selectIsUploadingFile = createSelector(selectMalariaState, state => state.isUploadingFile);

export const selectLastUpdatedDates = createSelector(selectMalariaState, state => state.lastUpdatedDates);

export const selectSelectionData = createSelector(selectMalariaState, state => state.selectionData);
