import React from "react";
import { connect } from "react-redux";
import YearRangeSelector from "../../../YearRangeSelector";
import VectorSpeciesFilter from "../../../filters/VectorSpeciesFilter";
import { InvasiveDiseaseFilter } from "../../../filters/DiseaseFilter";
import { Link } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { Snackbar } from "../../common/Snackbar";
import { State } from "../../../../store/types";
import { selectInvasiveFilters } from "../../../../store/reducers/invasive-reducer";
import { invitesAnophelesReports } from "../../../../../domain/entities/Disease";

const mapStateToProps = (state: State) => ({
    invasiveFilters: selectInvasiveFilters(state),
});

type Props = ReturnType<typeof mapStateToProps>;

function VectorOccuranceFilters({ invasiveFilters }: Props) {
    const { t } = useTranslation();
    return (
        <>
            <InvasiveDiseaseFilter />
            <VectorSpeciesFilter from="map" />
            <YearRangeSelector />
            {invitesAnophelesReports(invasiveFilters.disease) && (
                <Snackbar>
                    <Trans i18nKey="common.invasive.legend.vector_occurrance.link_content_1">
                        If you have detected invasive <i>Anopheles</i> vector species please report to us through the
                    </Trans>
                    <Link href={t("common.invasive.legend.vector_occurrance.link")} target="_blank">
                        {t("common.invasive.legend.vector_occurrance.link_text")}
                    </Link>
                </Snackbar>
            )}
        </>
    );
}

export default connect(mapStateToProps)(VectorOccuranceFilters);
