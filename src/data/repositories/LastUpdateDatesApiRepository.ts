import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { LastUpdatedDatesRepository } from "../../domain/repositories/LastUpdatedDatesRepository";
import { XMartApiResponse } from "../common/types";
import { LastUpdatedDates } from "../../domain/entities/LastUpdateDates";
import { Future } from "../../common/Future";

const emtyData: LastUpdatedDates = {
    AMDER_TES: null,
    HRP: null,
    INV: null,
    AMDERO_MM: null,
    HRPO: null,
    AMDER_MM: null,
    VIR_DIS: null,
    VIR_INT: null,
    VIR_SYN: null,
    VIR_RMD: null,
    AMDERO_TES: null,
};

export class LastUpdateDatesApiRepository implements LastUpdatedDatesRepository {
    constructor(private baseUrl: string) {}

    get(): FutureData<LastUpdatedDates> {
        return request<XMartApiResponse<FACT_UPDATE_ROW>>({ url: `${this.baseUrl}/FACT_UPDATE?$top=20` })
            .map(response => {
                const lastUpdateDates = response.value.reduce((acc: LastUpdatedDates, row: FACT_UPDATE_ROW) => {
                    return { ...acc, [row.THEME_NAME]: new Date(row.UPDATE_DATE) };
                }, emtyData);

                return lastUpdateDates;
            })
            .flatMapError(error => {
                console.log("Error loading last update dates from xmart", error);
                return Future.success(emtyData);
            });
    }
}

type FACT_UPDATE_ROW = {
    UPDATE_DATE: string;
    THEME_NAME: string;
};
