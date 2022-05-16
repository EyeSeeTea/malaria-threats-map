import React, { useMemo } from "react";

import { connect } from "react-redux";
import ActionGroupItem from "./ActionGroupItem";
import styled from "styled-components";
import MapTypesSelector from "../MapTypesSelector";
import { useTranslation } from "react-i18next";
import { selectFilters, selectRegion, selectTheme } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { selectInvasiveFilters } from "../../store/reducers/invasive-reducer";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { preventionSuggestions } from "../filters/PreventionMapTypesSelector";
import { diagnosisSuggestions } from "../filters/DiagnosisMapTypesSelector";
import { invasiveSuggestions } from "../filters/InvasiveMapTypesSelector";
import { treatmentSuggestions } from "../filters/TreatmentMapTypesSelector";
import { setMapTitleAction } from "../../store/actions/base-actions";

const Label = styled.span`
    font-weight: bold;
`;

const Value = styled.span`
    font-weight: normal;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    region: selectRegion(state),
    yearFilters: selectFilters(state),
});

const mapDispatchToProps = {
    setMapTitle: setMapTitleAction,
};
type DispatchProps = typeof mapDispatchToProps;
type StateProps = ReturnType<typeof mapStateToProps>;
type Props = DispatchProps & StateProps;

const MapTypeMapActions: React.FC<Props> = ({
    theme,
    preventionFilters,
    invasiveFilters,
    diagnosisFilters,
    treatmentFilters,
    setMapTitle,
}) => {
    const { t } = useTranslation();

    const selectedMapType = useMemo(() => {
        switch (theme) {
            case "prevention": {
                return preventionSuggestions[preventionFilters.mapType].title;
            }
            case "diagnosis": {
                return diagnosisSuggestions[diagnosisFilters.mapType].title;
            }
            case "invasive": {
                return invasiveSuggestions[invasiveFilters.mapType].title;
            }
            case "treatment": {
                return treatmentSuggestions[treatmentFilters.mapType].title;
            }
        }
    }, [theme, preventionFilters.mapType, diagnosisFilters.mapType, invasiveFilters.mapType, treatmentFilters.mapType]);

    React.useEffect(() => {
        setMapTitle(t(selectedMapType));
    }, [selectedMapType, t, setMapTitle]);

    return (
        <ActionGroupItem
            childrenMaxHeight={"420px"}
            placeholder={t("mapActions.selectMapType")}
            value={
                selectedMapType && (
                    <span>
                        <Label>{t("mapActions.mapType")}:&nbsp;</Label>
                        <Value>{t(selectedMapType)}</Value>
                    </span>
                )
            }
            actionGroupKey={"MAP_TYPE"}
        >
            {theme !== "diagnosis" && theme !== "invasive" && <MapTypesSelector />}
        </ActionGroupItem>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(MapTypeMapActions);
