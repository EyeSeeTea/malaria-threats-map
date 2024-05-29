import { Future } from "../../../common/Future";
import { FutureData } from "../../../domain/common/FutureData";
import { request } from "../../common/request";
import { CountryData, RefCountry, RefEndemicity, RefGeoRegion, XMartApiResponse } from "../../common/types";

export function getBackendCountries(xmartBaseUrl: string): FutureData<CountryData[]> {
    return Future.joinObj({
        //TODO: remove top 400
        endemicityCountries: request<XMartApiResponse<RefEndemicity>>({
            url: `${xmartBaseUrl}/FACT_ENDEMICITY?$top=400`,
        }),
        countries: request<XMartApiResponse<RefCountry>>({ url: `${xmartBaseUrl}/REF_COUNTRY` }),
        regions: request<XMartApiResponse<RefGeoRegion>>({ url: `${xmartBaseUrl}/REF_GEO_REGION` }),
    })
        .map(({ endemicityCountries, countries, regions }) => {
            return countries.value.map(country => {
                const endemicityCountry = endemicityCountries.value.find(
                    endemicityCountry => endemicityCountry.iso2Code === country.CODE_ISO_2
                );

                const region =
                    regions.value.find(region => region.GEO_REGION_CODE === country.GRP_WHO_REGION)
                        ?.GEO_REGION_NAME_SHORT || "";
                const subregion = endemicityCountry?.subregion || "";
                const endemicity = endemicityCountry?.endemicity || 0;

                return {
                    name: country.NAME_SHORT_EN,
                    iso2Code: country.CODE_ISO_2,
                    region: region.toUpperCase(),
                    subregion,
                    endemicity,
                };
            });
        })
        .flatMapError(error => {
            console.log("error loading countries from xmart", error);
            return Future.success([]);
        });
}
