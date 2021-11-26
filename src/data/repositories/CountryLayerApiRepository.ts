import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { ApiParams } from "../common/types";
import { CountryLayer } from "../../domain/entities/CountryLayer";
import { Future } from "../../common/Future";
import { CountryLayerRepository } from "../../domain/repositories/CountryLayerRepository";

type Country = {
    id: string;
    name: string;
    iso2Code: string;
    endemicity: boolean;
};

export class CountryLayerApiRepository implements CountryLayerRepository {
    constructor(private baseUrl: string, private backedBaseUrl: string) {}

    get(): FutureData<CountryLayer> {
        const params: ApiParams = {
            f: "geojson",
            where: `1=1`,
            outFields: "OBJECTID,ADM0_SOVRN,ADM0_NAME,SUBREGION,REGION_FULL,CENTER_LAT,CENTER_LON,ISO_2_CODE",
        };

        return this.getBackendCountries().flatMap(backendCountries => {
            console.log({ backendCountries });
            return request<CountryLayer>({ url: `${this.baseUrl}/3/query`, params }).map(countryLayer => {
                const newCountryLayer = {
                    ...countryLayer,
                    features: countryLayer.features.map(f => {
                        const backendCountry = backendCountries.find(c => c.iso2Code === f.properties.ISO_2_CODE);
                        const endemicity = backendCountry ? Number(backendCountry.endemicity) : 0;

                        return { ...f, properties: { ...f.properties, ENDEMICITY: endemicity } };
                    }),
                };

                console.log({ countryLayer });
                console.log({ newCountryLayer });

                return newCountryLayer;
            });
        });
    }

    private getBackendCountries(): FutureData<Country[]> {
        return request<Country[]>({ url: `${this.backedBaseUrl}/countries` }).flatMapError(error => {
            console.log("error loading countries from backend", error);
            return Future.success([]);
        });
    }
}
