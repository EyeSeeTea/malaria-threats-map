import React, { useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { setRegionAction, setSelection } from "../../store/actions/base-actions";
import { selectRegion, selectSelection } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { sendAnalytics } from "../../utils/analytics";
import SingleFilter from "./common/SingleFilter";
import { useTranslation } from "react-i18next";
import { Option } from "../BasicSelect";
import { selectCountries } from "../../store/reducers/country-layer-reducer";
import { selectCountries as selectCountriesTranslations } from "../../store/reducers/translations-reducer";
import { fetchCountryLayerRequest } from "../../store/actions/country-layer-actions";
import { CountryProperties } from "../../../domain/entities/CountryLayer";
import { resetSelectionInFeatures } from "../layers/effects";
import mapboxgl from "mapbox-gl";

const mapStateToProps = (state: State) => ({
    region: selectRegion(state),
    countries: selectCountries(state),
    countriesTranslation: selectCountriesTranslations(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setRegion: setRegionAction,
    fetchCountryLayer: fetchCountryLayerRequest,
    setSelection: setSelection,
};

type OwnProps = {
    map?: mapboxgl.Map;
    layerSource?: string;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

const CountrySelector = ({
    region,
    countries = [],
    setRegion,
    fetchCountryLayer,
    countriesTranslation,
    setSelection,
    map,
    layerSource,
    selection,
}: Props) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (!countries.length) {
            fetchCountryLayer();
        }
    }, [fetchCountryLayer, countries]);

    const onChange = useCallback(
        (selectedCountry?: string) => {
            if (selectedCountry) {
                sendAnalytics({ type: "event", category: "geoFilter", action: "Country", label: selectedCountry });

                const selectedCountryProperties = countries.find(el => el.ISO_2_CODE === selectedCountry);
                setRegion({
                    region: selectedCountry
                        ? selectedCountryProperties?.REGION_FULL.replaceAll(" ", "_") || ""
                        : region.region,
                    subRegion: selectedCountry
                        ? selectedCountryProperties?.SUBREGION?.replaceAll(" ", "_") || ""
                        : region.subRegion,
                    country: selectedCountry,
                });
            } else {
                setRegion({
                    ...region,
                    country: undefined,
                    site: "",
                    siteCoordinates: undefined,
                    siteIso2: "",
                });
            }
            if (map && layerSource && selection) resetSelectionInFeatures(map, layerSource, selection);
            if (selection) setSelection(null);
        },
        [map, layerSource, selection, setSelection, countries, setRegion, region]
    );

    const translatedCountries = countries.filter(el =>
        countriesTranslation.map(el => el.VALUE_).includes(el.ISO_2_CODE)
    );

    const suggestions: Option[] = translatedCountries
        .filter(el => (region.region ? el.REGION_FULL === region.region.replace("_", " ") : el))
        .map((country: CountryProperties) => ({
            label: t(`COUNTRY_NAME.${country.ISO_2_CODE}`),
            value: country.ISO_2_CODE,
        }))
        .filter(sug => sug.label);

    return (
        <SingleFilter
            label={t("common.filters.country")}
            placeholder={t("common.filters.select_country")}
            options={suggestions}
            onChange={onChange}
            value={region.country}
            menuPosition={"fixed"}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CountrySelector);
