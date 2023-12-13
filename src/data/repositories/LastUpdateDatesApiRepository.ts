import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { LastUpdatedDatesRepository } from "../../domain/repositories/LastUpdatedDatesRepository";
import { XMartApiResponse } from "../common/types";
import { LastUpdatedDates } from "../../domain/entities/LastUpdateDates";
import { Future } from "../../common/Future";

const emtyData: LastUpdatedDates = {
    prevention: null,
    diagnosisOngoing: null,
    diagnosis: null,
    treatment: null,
    treatmentOngoing: null,
    invasive: null,
};

export class LastUpdateDatesApiRepository implements LastUpdatedDatesRepository {
    constructor(private baseUrl: string) {}

    get(): FutureData<LastUpdatedDates> {
        return request<XMartApiResponse<FACT_UPDATE_ROW>>({ url: `${this.baseUrl}/FACT_UPDATE` })
            .map(response => {
                const lastUpdateDates = response.value.reduce((acc: LastUpdatedDates, row: FACT_UPDATE_ROW) => {
                    if (row.THEME_NAME === "AMDER") {
                        return { ...acc, treatment: new Date(row.UPDATE_DATE) };
                    } else if (row.THEME_NAME === "AMDERO") {
                        return { ...acc, treatmentOngoing: new Date(row.UPDATE_DATE) };
                    } else if (row.THEME_NAME === "HRP") {
                        return { ...acc, diagnosis: new Date(row.UPDATE_DATE) };
                    } else if (row.THEME_NAME === "HRPO") {
                        return { ...acc, diagnosisOnoing: new Date(row.UPDATE_DATE) };
                    } else if (row.THEME_NAME === "VIR") {
                        return { ...acc, prevention: new Date(row.UPDATE_DATE) };
                    } else if (row.THEME_NAME === "INV") {
                        return { ...acc, invasive: new Date(row.UPDATE_DATE) };
                    } else {
                        return { ...acc };
                    }
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
