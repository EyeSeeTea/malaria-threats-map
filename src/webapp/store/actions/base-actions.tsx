import { createAction, createCustomAction } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { RegionState, SiteSelection } from "../types";
import { AjaxError } from "rxjs/ajax";
import { UploadFileData } from "../../../domain/usecases/UploadFileUseCase";

interface SetThemeOptions {
    fromHome?: boolean;
}

export const setThemeAction = createCustomAction(
    ActionTypeEnum.MalariaSetTheme,
    (theme: string, options: SetThemeOptions = {}) => ({
        payload: theme,
        meta: options,
    })
);

interface GAEvent {
    category: string;
    action: string;
    label?: string;
}

export interface GAPageView {
    path: string;
}

export const logEventAction = createAction(ActionTypeEnum.MalariaLogEvent)<GAEvent>();

export const logPageViewAction = createAction(
    ActionTypeEnum.MalariaLogPageView,
    (pageView: GAPageView | undefined) => pageView || null
)<GAPageView | undefined>();

export const logOutboundLinkAction = createAction(ActionTypeEnum.MalariaLogOutboundLink)<string>();

export const setRegionAction = createAction(ActionTypeEnum.MalariaSetRegion)<RegionState | null>();

export const setFiltersAction = createAction(ActionTypeEnum.MalariaSetFilters)<number[] | undefined>();

export const toggleEndemicityLayerAction = createAction(ActionTypeEnum.MalariaToogleEndemicityLayer)<boolean>();

export const setCountryModeAction = createAction(ActionTypeEnum.MalariaSetCountryMode)<boolean>();

export const setStoryModeAction = createAction(ActionTypeEnum.MalariaSetStoryMode)<boolean>();

export const setStoryModeStepAction = createAction(ActionTypeEnum.MalariaSetStoryModeStep)<number>();

export const setInitialDialogOpen = createAction(ActionTypeEnum.MalariaSetInitialDialogOpen)<boolean>();

export const setFiltersOpen = createAction(ActionTypeEnum.SetFiltersOpen)<boolean>();

//new ones
export const setTooltipOpen = createAction(ActionTypeEnum.SetTooltipOpen)<boolean>();

export const setViewData = createAction(ActionTypeEnum.SetViewData)<SiteSelection | null>();

export const setFiltersMode = createAction(ActionTypeEnum.SetFiltersMode)<string>();

export const setSelection = createAction(ActionTypeEnum.SetSelection)<SiteSelection | null>();

export const setMobileOptionsOpen = createAction(ActionTypeEnum.SetMobileOptionsOpen)<boolean>();

export const updateZoomAction = createAction(ActionTypeEnum.UpdateZoom)<number>();

export const updateBoundsAction = createAction(ActionTypeEnum.UpdateBounds)<Array<Array<number>>>();

export const setBoundsAction = createAction(ActionTypeEnum.SetBounds)<Array<Array<number>>>();

export const setTourOpenAction = createAction(ActionTypeEnum.SetTourOpen)<boolean>();

export const setTourStepAction = createAction(ActionTypeEnum.SetTourStep)<number>();

export const setDataDownloadOpenAction = createAction(ActionTypeEnum.SetDataDownloadOpen)<boolean>();

export const setReportOpenAction = createAction(ActionTypeEnum.SetReportOpen)<boolean>();

export const setMapTitleAction = createAction(ActionTypeEnum.SetMapTitle)<string>();

export const setSubscriptionOpenAction = createAction(ActionTypeEnum.SetSubscriptionOpen)<boolean>();

export const setUploadFileOpenAction = createAction(ActionTypeEnum.SetUploadFileOpen)<boolean>();

export const setFeedbackOpenAction = createAction(ActionTypeEnum.SetFeedbackOpen)<boolean>();

export const setTheaterModeAction = createAction(ActionTypeEnum.SetTheaterMode)<boolean>();

export const setLegendExpandedAction = createAction(ActionTypeEnum.SetLegendExpanded)<boolean>();

export const getLastUpdatedRequestAction = createAction(ActionTypeEnum.GetLastUpdatedRequest)();

type LastUpdated = { prevention: Date; diagnosis: Date; treatment: Date; invasive: Date };

export const getLastUpdatedSuccessAction = createAction(ActionTypeEnum.GetLastUpdatedSuccess)<LastUpdated>();

export const getLastUpdatedFailureAction = createAction(ActionTypeEnum.GetLastUpdatedFailure)<AjaxError | string>();

export const uploadFileRequestAction = createAction(ActionTypeEnum.UploadFileRequest)<UploadFileData>();

export const uploadFileSuccessAction = createAction(ActionTypeEnum.UploadFileSuccess)();

export const uploadFileErrorAction = createAction(ActionTypeEnum.UploadFileError)();
