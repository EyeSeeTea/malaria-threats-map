import React, { useEffect } from "react";
import { connect } from "react-redux";
import { setRegionAction } from "../../store/actions/base-actions";
import { selectRegion } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { sendAnalytics } from "../../utils/analytics";
import SingleFilter from "./common/SingleFilter";
import { useTranslation } from "react-i18next";
import { Option } from "../BasicSelect";
import { selectCountries } from "../../store/reducers/country-layer-reducer";
import { selectCountries as selectCountriesTranslations } from "../../store/reducers/translations-reducer";
import { fetchCountryLayerRequest } from "../../store/actions/country-layer-actions";
import { CountryProperties } from "../../../domain/entities/CountryLayer";

const mapStateToProps = (state: State) => ({
    region: selectRegion(state),
    countries: selectCountries(state),
    countriesTranslation: selectCountriesTranslations(state),
});

const mapDispatchToProps = {
    setRegion: setRegionAction,
    fetchCountryLayer: fetchCountryLayerRequest,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const CountrySelector = ({ region, countries = [], setRegion, fetchCountryLayer, countriesTranslation }: Props) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (!countries.length) {
            fetchCountryLayer();
        }
    }, [fetchCountryLayer, countries]);

    const onChange = (selection?: string) => {
        if (selection) sendAnalytics({ type: "event", category: "geoFilter", action: "Country", label: selection });
        setRegion({
            region: countries.find(el => el.ISO_2_CODE === selection)?.REGION_FULL.replaceAll(" ", "_") || "",
            subRegion: countries.find(el => el.ISO_2_CODE === selection)?.SUBREGION?.replaceAll(" ", "_") || "",
            country: selection,
        });
    };

    const translatedCountries = countries.filter(el =>
        countriesTranslation.map(el => el.VALUE_).includes(el.ISO_2_CODE)
    );

    const suggestions: Option[] = translatedCountries
        .filter(el => (region.region ? el.REGION_FULL === region.region.replace("_", " ") : el))
        .map((country: CountryProperties) => ({
            label: t(`countries.${country.ISO_2_CODE}`),
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
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CountrySelector);
