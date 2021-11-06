import React from "react";
import { connect } from "react-redux";
import { setRegionAction } from "../../store/actions/base-actions";
import { selectRegion } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { Translation } from "../../types/Translation";
import { selectCountries } from "../../store/reducers/translations-reducer";
import { sendAnalytics } from "../../utils/analytics";
import SingleFilter from "./common/SingleFilter";
import { useTranslation } from "react-i18next";
import { Option } from "../BasicSelect";

const mapStateToProps = (state: State) => ({
    region: selectRegion(state),
    countries: selectCountries(state),
});

const mapDispatchToProps = {
    setRegion: setRegionAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const CountrySelector = ({ region, countries = [], setRegion }: Props) => {
    console.log(region);
    const { t } = useTranslation();
    const onChange = (selection?: string) => {
        if (selection) sendAnalytics({ type: "event", category: "geoFilter", action: "Country", label: selection });
        setRegion({ country: selection });
    };

    const suggestions: Option[] = countries
        .map((country: Translation) => ({
            label: t(country.VALUE_ === "NA" ? "common.COUNTRY_NA" : country.VALUE_),
            value: country.VALUE_,
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
