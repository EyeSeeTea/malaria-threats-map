import React, { useMemo } from "react";

import { connect } from "react-redux";
import ActionGroupItem from "./ActionGroupItem";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { selectFilters, selectMaxMinYears, selectTheme } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { selectInvasiveFilters } from "../../store/reducers/invasive-reducer";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { selectTranslations } from "../../store/reducers/translations-reducer";
import { filtersToString } from "./utils";
import { Source } from "../../store/actions/base-actions";
import DownloadFiltersContent from "../filters/container/DownloadFiltersContent";
import MapFiltersContent from "../filters/container/MapFiltersContent";
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
    maxMinYears: selectMaxMinYears(state),
    yearFilters: selectFilters(state),
    translations: selectTranslations(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
interface OwnProps {
    from: Source;
}
type Props = OwnProps & StateProps;

const DataMapActions: React.FC<Props> = ({
    from,
    theme,
    preventionFilters,
    invasiveFilters,
    diagnosisFilters,
    treatmentFilters,
    maxMinYears,
    yearFilters,
    translations,
}) => {
    const { t } = useTranslation();

    const selectedFilters = useMemo(() => {
        if (!translations) return;

        return filtersToString(
            theme,
            preventionFilters,
            treatmentFilters,
            diagnosisFilters,
            invasiveFilters,
            maxMinYears,
            yearFilters,
            from
        );
    }, [
        theme,
        preventionFilters,
        treatmentFilters,
        translations,
        maxMinYears,
        yearFilters,
        diagnosisFilters,
        invasiveFilters,
        from,
    ]);

    return (
        <Box id="dataFilters">
            <ActionGroupItem
                childrenMaxHeight={"400px"}
                placeholder={from === "map" ? t("mapActions.selectDataMap") : t("mapActions.selectDataDownload")}
                actionGroupKey={"DATA"}
                value={
                    selectedFilters && (
                        <span>
                            <Label>{t("mapActions.data")}:&nbsp;</Label>
                            <Value>{t(selectedFilters)}</Value>
                        </span>
                    )
                }
            >
                {from === "map" ? <MapFiltersContent /> : <DownloadFiltersContent />}
            </ActionGroupItem>
        </Box>
    );
};

export default connect(mapStateToProps)(DataMapActions);
