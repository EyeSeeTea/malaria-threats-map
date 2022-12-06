import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { ApiParams, CountryData, XMartApiResponse } from "../common/types";
import { CountryLayer } from "../../domain/entities/CountryLayer";
import { Future } from "../../common/Future";
import { CountryLayerRepository } from "../../domain/repositories/CountryLayerRepository";

export class CountryLayerApiRepository implements CountryLayerRepository {
    constructor(private baseUrl: string, private xmartBaseUrl: string) {}

    get(): FutureData<CountryLayer> {
        const params: ApiParams = {
            f: "geojson",
            where: `1=1`,
            outFields: "OBJECTID,ADM0_SOVRN,ADM0_NAME,CENTER_LAT,CENTER_LON,ISO_2_CODE,ENDDATE",
        };

        return this.getBackendCountries().flatMap(backendCountries => {
            return request<CountryLayer>({
                url: `${this.baseUrl}/Detailed_Boundary_ADM0/FeatureServer/0/query`,
                params,
            }).map(countryLayer => {
                const newCountryLayer = {
                    ...countryLayer,
                    features: countryLayer.features
                        .filter(feature => feature.properties.ENDDATE > new Date().getTime())
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
                        }),
                };

                return newCountryLayer;
            });
        });
    }

    private getBackendCountries(): FutureData<CountryData[]> {
        return request<XMartApiResponse<CountryData>>({ url: `${this.xmartBaseUrl}/FACT_ENDEMICITY_REGIONS` })
            .map(response => response.value)
            .flatMapError(error => {
                console.log("error loading countries from xmart", error);
                return Future.success([]);
            });
    }
}
