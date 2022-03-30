import React from "react";
import { connect } from "react-redux";
import { setRegionAction } from "../../store/actions/base-actions";
import { selectRegion, selectTheme } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { selectFilteredPreventionStudies } from "../../store/reducers/prevention-reducer";
import { selectFilteredDiagnosisStudies } from "../../store/reducers/diagnosis-reducer";
import { selectFilteredTreatmentStudies } from "../../store/reducers/treatment-reducer";
import { selectFilteredInvasiveStudies } from "../../store/reducers/invasive-reducer";
import * as R from "ramda";
import { sendAnalytics } from "../../utils/analytics";
import { Study } from "../../../domain/entities/Study";
import { useTranslation } from "react-i18next";
import SingleFilter from "./common/SingleFilter";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionStudies: selectFilteredPreventionStudies(state),
    diagnosisStudies: selectFilteredDiagnosisStudies(state),
    treatmentStudies: selectFilteredTreatmentStudies(state),
    invasiveStudies: selectFilteredInvasiveStudies(state),
    region: selectRegion(state),
});

const mapDispatchToProps = {
    setRegion: setRegionAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function SiteSelector({
    theme,
    preventionStudies,
    diagnosisStudies,
    treatmentStudies,
    invasiveStudies,
    region,
    setRegion,
}: Props) {
    const { t } = useTranslation();

    const studies: Study[] = (() => {
        switch (theme) {
            case "prevention":
                return preventionStudies;
            case "diagnosis":
                return diagnosisStudies;
            case "treatment":
                return treatmentStudies;
            case "invasive":
                return invasiveStudies;
        }
    })();

    const SITES_SUGGESTIONS = R.uniqBy(
        study => study.value,
        studies.map(study => ({
            label: study.SITE_NAME || study.VILLAGE_NAME,
            value: study.SITE_ID,
            iso2: study.ISO2,
            coords: [study.Latitude, study.Longitude],
        }))
    );

    const suggestions = SITES_SUGGESTIONS.sort((a, b) => (a.label < b.label ? -1 : 1)).slice(0, 10);

    const onChange = (selection?: string) => {
        const site = suggestions.find(site => site.value === selection);
        if (site) sendAnalytics({ type: "event", category: "geoFilter", action: "Site", label: selection });
        setRegion({
            site: site ? site.value : undefined,
            siteLabel: site ? site.label : undefined,
            siteIso2: site ? site.iso2 : undefined,
            siteCoordinates: site ? [+site.coords[0], +site.coords[1]] : undefined,
            country: site ? site.iso2 : undefined,
        });
    };

    return (
        <SingleFilter
            label={t("common.filters.site")}
            placeholder={t("common.filters.select_site")}
            options={suggestions}
            onChange={onChange}
            value={region.site}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteSelector);
