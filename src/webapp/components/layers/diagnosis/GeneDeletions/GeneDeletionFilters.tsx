import React from "react";
import { useTranslation, Trans } from "react-i18next";
import YearRangeSelector from "../../../YearRangeSelector";
import SurveyTypeFilter from "../../../filters/SurveyTypeFilter";
import PatientTypeFilter from "../../../filters/PatientTypeFilter";
import DeletionTypeFilter from "../../../filters/DeletionTypeFilter";
import { Snackbar } from "../../../Filters";

export default function GeneDeletionFilters() {
    const { t } = useTranslation();

    return (
        <>
            <DeletionTypeFilter />
            <SurveyTypeFilter />
            <PatientTypeFilter />
            <YearRangeSelector minYear={1998} maxYear={new Date().getFullYear()} />
            <Snackbar>
                <Trans i18nKey="common.filters.pfhrp23_note" t={t}>
                    Across surveys, the criteria for selecting samples to test for<i>pfhrp 2/3</i>deletions varies;
                    therefore, refer to the full report cited for more details.
                </Trans>
            </Snackbar>
        </>
    );
}
