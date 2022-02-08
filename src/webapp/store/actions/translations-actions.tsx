import { createAction } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import { AjaxError } from "rxjs/ajax";
import { TranslationResponse } from "../../types/Translation";

export const fetchTranslationsRequestAction = createAction(ActionTypeEnum.FetchTranslationsRequest)();

export const fetchTranslationsSuccessAction = createAction(
    ActionTypeEnum.FetchTranslationsSuccess
)<TranslationResponse>();

export const fetchTranslationsErrorAction = createAction(ActionTypeEnum.FetchTranslationsError)<AjaxError>();
