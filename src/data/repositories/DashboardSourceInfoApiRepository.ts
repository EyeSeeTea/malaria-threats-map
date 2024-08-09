import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { XMartApiResponse } from "../common/types";
import { DashboardSourceInfoRepository } from "../../domain/repositories/DashboardSourceInfoRepository";
import { DashboardSourceInfo } from "../../domain/entities/DashboardSourceInfo";

export class DashboardSourceInfoApiRepository implements DashboardSourceInfoRepository {
    constructor(private xmartBaseUrl: string) {}

    get(): FutureData<DashboardSourceInfo[]> {
        return request<XMartApiResponse<DashboardSourceInfo>>({
            url: `${this.xmartBaseUrl}/FACT_WMR_REPORTYR`,
        }).map(response => {
            return response.value.map(sourceInfo => this.buildDashboardSourceInfo(sourceInfo));
        });
    }

    private buildDashboardSourceInfo(sourceInfo: DashboardSourceInfo): DashboardSourceInfo {
        return {
            DATA_YR: sourceInfo.DATA_YR,
            LINK: sourceInfo.LINK,
            NAME: sourceInfo.NAME,
        };
    }
}
