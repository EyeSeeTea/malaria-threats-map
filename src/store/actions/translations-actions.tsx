import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import { AjaxError } from "rxjs/ajax";
import { TranslationResponse } from "../../types/Translation";

export const fetchTranslationsRequestAction = createAction(ActionTypeEnum.FetchTranslationsRequest, action => {
    return () => action();
});
export const fetchTranslationsSuccessAction = createAction(ActionTypeEnum.FetchTranslationsSuccess, action => {
    return (translations: TranslationResponse) => action(translations);
});
export const fetchTranslationsErrorAction = createAction(ActionTypeEnum.FetchTranslationsError, action => {
    return (error: AjaxError) => action();
});
