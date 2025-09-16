import React, { useCallback } from "react";
import { connect } from "react-redux";
import { setRegionAction, setSelection } from "../../store/actions/base-actions";
import { selectRegion, selectSelection, selectTheme } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { selectFilteredPreventionStudies } from "../../store/reducers/prevention-reducer";
import { selectFilteredDiagnosisStudies } from "../../store/reducers/diagnosis-reducer";
import { selectFilteredTreatmentStudies } from "../../store/reducers/treatment-reducer";
import { selectFilteredInvasiveStudies } from "../../store/reducers/invasive-reducer";
import * as R from "ramda";
import { sendAnalytics } from "../../utils/analytics";
import { getRegionBySite, Study } from "../../../domain/entities/Study";
import { useTranslation } from "react-i18next";
import SingleFilter from "./common/SingleFilter";
import { isNotNull } from "../../utils/number-utils";
import { resetSelectionInFeatures } from "../layers/effects";
import mapboxgl from "mapbox-gl";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionStudies: selectFilteredPreventionStudies(state),
    diagnosisStudies: selectFilteredDiagnosisStudies(state),
    treatmentStudies: selectFilteredTreatmentStudies(state),
    invasiveStudies: selectFilteredInvasiveStudies(state),
    region: selectRegion(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setRegion: setRegionAction,
    setSelection: setSelection,
};

type OwnProps = {
    map?: mapboxgl.Map;
    layerSource?: string;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

function SiteSelector({
    theme,
    preventionStudies,
    diagnosisStudies,
    treatmentStudies,
    invasiveStudies,
    region,
    setRegion,
    setSelection,
    map,
    layerSource,
    selection,
}: Props) {
    const { t } = useTranslation();

    const studies: Study[] = React.useMemo(() => {
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
    }, [theme, preventionStudies, diagnosisStudies, treatmentStudies, invasiveStudies]);

    const siteRegions = React.useMemo(() => {
        return R.uniqBy(
            study => study.site && study.siteLabel,
            studies.map(study => getRegionBySite(study))
        )
            .filter(s => isNotNull(s.siteLabel))
            .sort((a, b) => (a.siteLabel < b.siteLabel ? -1 : 1));
    }, [studies]);

    const suggestions = React.useMemo(() => {
        return siteRegions.map(siteRegion => {
            return {
                label: siteRegion.siteLabel,
                value: siteRegion.site,
            };
        });
    }, [siteRegions]);

    const onChange = useCallback(
        (siteSelected?: string) => {
            const site = siteRegions.find(site => site.site === siteSelected);

            if (site) {
                sendAnalytics({ type: "event", category: "geoFilter", action: "Site", label: siteSelected });

                setRegion(site);

                setSelection({
                    ISO_2_CODE: site.siteIso2,
                    SITE_ID: site.site,
                    coordinates: site.siteCoordinates,
                    OBJECTIDs: [],
                });
            } else {
                if (map && layerSource && selection) resetSelectionInFeatures(map, layerSource, selection);

                setRegion({
                    ...region,
                    site: "",
                    siteCoordinates: undefined,
                    siteIso2: "",
                });

                if (selection) setSelection(null);
            }
        },
        [siteRegions, setRegion, setSelection, region, map, layerSource, selection]
    );

    return (
        <SingleFilter
            optimizePerformance={true}
            label={t("common.filters.site")}
            placeholder={t("common.filters.select_site")}
            options={suggestions}
            onChange={onChange}
            value={region.site}
            menuPosition={"fixed"}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteSelector);
