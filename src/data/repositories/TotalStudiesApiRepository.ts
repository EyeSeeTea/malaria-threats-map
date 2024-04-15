import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { XMartApiResponse } from "../common/types";
import { TotalStudiesRepository } from "../../domain/repositories/TotalStudiesRepository";
import { TotalStudiesInThemes } from "../../domain/entities/TotalStudiesInThemes";

export class TotalStudiesApiRepository implements TotalStudiesRepository {
    constructor(private xmartBaseUrl: string) {}

    getTotalStudiesInThemes(): FutureData<TotalStudiesInThemes | undefined> {
        return request<XMartApiResponse<FACT_THEME_TOTALS_ROW>>({
            url: `${this.xmartBaseUrl}/FACT_THEME_TOTALS`,
        }).map(response => {
            if (response?.value[0]) {
                return this.buildTotalStudiesInThemes(response.value[0]);
            }
            return undefined;
        });
    }

    private buildTotalStudiesInThemes(themeTotalCounts: FACT_THEME_TOTALS_ROW): TotalStudiesInThemes {
        return {
            prevention: themeTotalCounts?.prevention_count,
            diagnosis: themeTotalCounts?.diagnosis_count,
            treatment: themeTotalCounts?.treatment_count,
            invasive: themeTotalCounts?.invasive_count,
        };
    }
}

type FACT_THEME_TOTALS_ROW = {
    prevention_count: number;
    invasive_count: number;
    diagnosis_count: number;
    treatment_count: number;
};
