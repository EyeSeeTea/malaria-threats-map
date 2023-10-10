import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { LastUpdatedDatesRepository } from "../../domain/repositories/LastUpdatedDatesRepository";
import { ApiResponse, ApiParams, Feature } from "../common/types";
import { LastUpdatedDates } from "../../domain/entities/LastUpdateDates";

const emtyData: LastUpdatedDates = {
    prevention: null,
    preventionOngoing: null,
    diagnosis: null,
    treatment: null,
    treatmentOngoing: null,
    invasive: null,
};

export class LastUpdateDatesApiRepository implements LastUpdatedDatesRepository {
    constructor(private baseUrl: string) {}

    get(): FutureData<LastUpdatedDates> {
        const params: ApiParams = {
            f: "json",
            where: `1=1`,
            outFields: "*",
        };

        return request<ApiResponse<ArcgGisLastUpdateDates>>({ url: `${this.baseUrl}/9/query`, params }).map(
            response => {
                const lastUpdateDates = response.features.reduce(
                    (acc: LastUpdatedDates, feature: Feature<ArcgGisLastUpdateDates>) => {
                        if (feature.attributes.TABLE_NAME === "TREATMENT") {
                            return { ...acc, treatment: new Date(feature.attributes.DATE) };
                        } else if (feature.attributes.TABLE_NAME === "HRP") {
                            return { ...acc, diagnosis: new Date(feature.attributes.DATE) };
                        } else if (feature.attributes.TABLE_NAME === "PREVENTION") {
                            return { ...acc, prevention: new Date(feature.attributes.DATE) };
                        } else if (feature.attributes.TABLE_NAME === "INVASIVE") {
                            return { ...acc, invasive: new Date(feature.attributes.DATE) };
                        } else {
                            return { ...acc };
                        }
                    },
                    emtyData
                );

                return lastUpdateDates;
            }
        );
    }
}

type ArcgGisLastUpdateDates = {
    DATE: number;
    OBJECTID: number;
    TABLE_NAME: "TREATMENT";
};
