import React from "react";

import { State } from "../../store/types";
import { connect } from "react-redux";
import { selectCountryMode, selectFilters, selectTheme } from "../../store/reducers/base-reducer";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { setPreventionMapType } from "../../store/actions/prevention-actions";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { selectInvasiveFilters } from "../../store/reducers/invasive-reducer";
import ExpandableContainer from "../DataDownload/ExpandableContainer";
import { LegendTitle } from "./LegendTitle";
import { getLegendLabels } from "./utils";
import LegendContent from "./LegendContent";
import { selectTranslations } from "../../store/reducers/translations-reducer";
import LegendFooter from "./LegendFooter";

const mapStateToProps = (state: State) => ({
    filters: selectFilters(state),
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    countryMode: selectCountryMode(state),
    translations: selectTranslations(state),
});

const mapDispatchToProps = {
    setPreventionMapType: setPreventionMapType,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const Legend: React.FC<Props> = ({
    theme,
    preventionFilters,
    diagnosisFilters,
    treatmentFilters,
    invasiveFilters,
    countryMode,
    translations,
}) => {
    const title = React.useMemo(() => {
        if (!translations) return "";

        return LegendTitle(theme, preventionFilters, diagnosisFilters, treatmentFilters, invasiveFilters, countryMode);
    }, [theme, preventionFilters, diagnosisFilters, treatmentFilters, invasiveFilters, countryMode, translations]);

    const labels = React.useMemo(
        () =>
            getLegendLabels(theme, preventionFilters, diagnosisFilters, treatmentFilters, invasiveFilters, countryMode),
        [theme, preventionFilters, diagnosisFilters, treatmentFilters, invasiveFilters, countryMode]
    );

    return (
        <ExpandableContainer value={title} expanded={true}>
            <LegendContent labels={labels} />
            <LegendFooter />
        </ExpandableContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Legend);
