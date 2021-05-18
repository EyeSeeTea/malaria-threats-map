import * as React from "react";
import { Box, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import { setCountryModeAction, setRegionAction } from "../../../../store/actions/base-actions";
import { formatYears } from "../../../../utils/string-utils";
import { selectTreatmentFilters } from "../../../../store/reducers/treatment-reducer";
import { MOLECULAR_MARKERS } from "../../../filters/MolecularMarkerFilter";
import { Actions, ChartContainer, FlexGrow, ZoomButton } from "../../../Chart";
import { TreatmentStudy } from "../../../../../domain/entities/TreatmentStudy";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    treatmentFilters: selectTreatmentFilters(state),
});
const mapDispatchToProps = {
    setRegion: setRegionAction,
    setCountryMode: setCountryModeAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    studies: TreatmentStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

const MolecularMarkersCountryChart = ({ studies, setRegion, setCountryMode, treatmentFilters }: Props) => {
    const { t } = useTranslation("common");
    const nStudies = studies.length;
    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
    const maxYear = sortedStudies[sortedStudies.length - 1].YEAR_START;
    const minYear = sortedStudies[0].YEAR_START;
    const onClick = () => {
        setRegion({ country: studies[0].ISO2 });
        setCountryMode(false);
    };
    const molecularMarker = t(MOLECULAR_MARKERS.find((m: any) => m.value === treatmentFilters.molecularMarker).label);
    return (
        <ChartContainer>
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${t(
                    studies[0].ISO2 === "NA" ? "COUNTRY_NA" : studies[0].ISO2
                )}`}</Box>
            </Typography>
            <Typography variant="subtitle2">
                {t("treatment.chart.molecular_markers.content", {
                    nStudies,
                    molecularMarker: t(molecularMarker),
                    years: formatYears(minYear, maxYear),
                })}
            </Typography>
            <Actions>
                <FlexGrow />
                <ZoomButton onClick={onClick} />
            </Actions>
        </ChartContainer>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(MolecularMarkersCountryChart);
