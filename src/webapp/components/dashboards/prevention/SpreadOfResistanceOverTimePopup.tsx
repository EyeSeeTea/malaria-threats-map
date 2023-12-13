import React from "react";
import { Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import InformationModal, { SpecificInformationModalProps } from "../InformationModal";
import { escape } from "lodash";

const SpreadOfResistanceOverTimePopup: React.FC<SpecificInformationModalProps> = ({
    years,
    openInfoModal,
    handleCloseInfoModal,
}) => {
    const { t } = useTranslation();

    return (
        <InformationModal
            title={t("common.dashboard.informationModal.spreadOfResistanceOverTimePopup.title")}
            years={years}
            openInfoModal={openInfoModal}
            handleCloseInfoModal={handleCloseInfoModal}
        >
            <Typography variant="body1">
                <Trans
                    i18nKey="common.dashboard.informationModal.spreadOfResistanceOverTimePopup.lineChartInterpretation"
                    t={t}
                    values={{ lessThan: escape("<") }}
                >
                    <strong>Line chart interpretation:</strong> In this graph, the cumulative number of sites that have
                    confirmed resistance to each insecticide or class (i.e. mosquito mortality less than 90% on WHO or
                    CDC bioassay with the discriminating insecticide concentration) is plotted against the year. The
                    area of the circles on the graph represents that total number of sites that monitored resistance
                    that year.
                </Trans>
            </Typography>
            <Typography variant="body1">
                <Trans
                    i18nKey="common.dashboard.informationModal.spreadOfResistanceOverTimePopup.barChartInterpretation"
                    t={t}
                    shouldUnescape={true}
                >
                    <strong>Bar chart interpretation:</strong> This graph presents the number of sites that monitored
                    insecticide resistance per year, disaggregated by those that confirmed resistance (red), those that
                    detected possible resistance (orange) and those where mosquitoes were susceptible to the insecticide
                    (green).
                </Trans>
            </Typography>
            <Typography variant="body1">
                <Trans
                    i18nKey="common.dashboard.informationModal.spreadOfResistanceOverTimePopup.disaggregatedView"
                    t={t}
                    shouldUnescape={true}
                >
                    <strong>Disaggregated view:</strong> The graphs can be viewed by insecticide class or by
                    insecticide, and for all vector species together or disaggregated by species.
                </Trans>
            </Typography>
            <Typography variant="body1">
                <Trans
                    i18nKey="common.dashboard.informationModal.spreadOfResistanceOverTimePopup.typeOfResistanceMonitoringBioassay"
                    t={t}
                    shouldUnescape={true}
                    values={{ lessThan: escape("<") }}
                >
                    <strong>Type of resistance monitoring bioassay:</strong> Resistance to insecticides was determined
                    by mosquito mortality (CDC bottle bioassay, WHO tube test or WHO bottle bioassay). Confirmed
                    resistance is classified as mosquito mortality less than 90%.
                </Trans>
            </Typography>
        </InformationModal>
    );
};

export default SpreadOfResistanceOverTimePopup;
