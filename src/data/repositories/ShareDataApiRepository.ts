import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { XMartApiResponse } from "../common/types";
import { ShareDataContent } from "../../domain/entities/ShareDataContent";
import { ShareDataRepository } from "../../domain/repositories/ShareDataRepository";

export class ShareDataApiRepository implements ShareDataRepository {
    constructor(private baseUrl: string) {}

    get(): FutureData<ShareDataContent> {
        return request<XMartApiResponse<SurveyLinkData>>({
            url: `${this.baseUrl}/FACT_SURVEYLINKS`,
        }).map<ShareDataContent>(response => {
            return {
                surveyLinks: response.value.map(item => ({
                    id: item.SURVEY_ID,
                    name: item.SURVEY_NAME,
                    link: item.SURVEY_LINK,
                })),
            };
        });
    }
}

type SurveyLinkData = {
    SURVEY_ID: string;
    SURVEY_NAME: string;
    SURVEY_LINK: string;
};
