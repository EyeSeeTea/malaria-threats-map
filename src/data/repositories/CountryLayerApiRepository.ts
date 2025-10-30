import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { ApiParams, CountryData } from "../common/types";
import { CountryFeature, CountryLayer } from "../../domain/entities/CountryLayer";
import { CountryLayerRepository } from "../../domain/repositories/CountryLayerRepository";
import { getBackendCountries } from "./common/getBackendCountries";
import { Future } from "../../common/Future";

const DEFAULT_PAGE_SIZE = 100;

export class CountryLayerApiRepository implements CountryLayerRepository {
    constructor(private baseUrl: string, private xmartBaseUrl: string) {}

    get(): FutureData<CountryLayer> {
        const baseParams: ApiParams = {
            f: "geojson",
            where: `1=1`,
            outFields: "OBJECTID,ADM0_SOVRN,ADM0_NAME,CENTER_LAT,CENTER_LON,ISO_2_CODE,ENDDATE",
            maxAllowableOffset: 0.001,
        };

        return getBackendCountries(this.xmartBaseUrl).flatMap(backendCountries => {
            return this.fetchAllPages(baseParams, backendCountries);
        });
    }

    private fetchAllPages(
        baseParams: ApiParams,
        backendCountries: CountryData[],
        offset = 0,
        pageSize = DEFAULT_PAGE_SIZE,
        accumulatedFeatures: CountryFeature[] = []
    ): FutureData<CountryLayer> {
        const params: ApiParams = {
            ...baseParams,
            resultOffset: offset,
            resultRecordCount: pageSize,
        };

        return request<CountryLayer>({
            url: `${this.baseUrl}/Detailed_Boundary_ADM0/FeatureServer/0/query`,
            params,
        })
            .flatMap(countryLayer => {
                const currentTime = new Date().getTime();
                const processedFeatures = countryLayer.features
                    .filter(feature => feature.properties.ENDDATE > currentTime)
                    .map(f => {
                        const backendCountry = backendCountries.find(c => c.iso2Code === f.properties.ISO_2_CODE);

                        if (!backendCountry) {
                            console.log("Country non existed in backend", { f });
                        }

                        const endemicity = backendCountry ? Number(backendCountry.endemicity) : 0;

                        return {
                            ...f,
                            properties: {
                                ...f.properties,
                                REGION_FULL: backendCountry?.region,
                                SUBREGION: backendCountry?.subregion,
                                ENDEMICITY: endemicity,
                            },
                        };
                    });

                const allFeatures = [...accumulatedFeatures, ...processedFeatures];

                if (countryLayer.features.length === pageSize) {
                    return this.fetchAllPages(baseParams, backendCountries, offset + pageSize, pageSize, allFeatures);
                } else {
                    return Future.success({
                        ...countryLayer,
                        features: allFeatures,
                    });
                }
            })
            .flatMapError(error => {
                console.log("error loading country layers", error);
                return Future.error(new Error("Error loading country layers"));
            });
    }
}
