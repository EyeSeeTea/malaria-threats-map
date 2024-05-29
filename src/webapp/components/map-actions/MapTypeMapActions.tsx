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
import { setMapTitleAction } from "../../store/actions/base-actions";
import { getMapType } from "./utils";
import { Box } from "@mui/material";

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
        return getMapType(theme, preventionFilters, treatmentFilters, diagnosisFilters, invasiveFilters);
    }, [theme, preventionFilters, diagnosisFilters, invasiveFilters, treatmentFilters]);

    React.useEffect(() => {
        setMapTitle(t(selectedMapType));
    }, [selectedMapType, t, setMapTitle]);

    return (
        <Box id="mapType">
            <ActionGroupItem
                childrenMaxHeight={"420px"}
                placeholder={t("mapActions.selectMapType")}
                value={
                    selectedMapType && (
                        <span>
                            <Label>{t("mapActions.mapType")}:&nbsp;</Label>
                            <Value>{t(`${selectedMapType}_selected`)}</Value>
                        </span>
                    )
                }
                actionGroupKey={"MAP_TYPE"}
            >
                {theme !== "invasive" && <MapTypesSelector />}
            </ActionGroupItem>
        </Box>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(MapTypeMapActions);
