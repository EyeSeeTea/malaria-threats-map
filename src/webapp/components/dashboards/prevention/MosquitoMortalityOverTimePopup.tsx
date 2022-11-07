import React from "react";
import { Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import InformationModal, { SpecificInformationModalProps } from "../InformationModal";
import { escape } from "lodash";

const MosquitoMortalityOverTimePopup: React.FC<SpecificInformationModalProps> = ({
    years,
    openInfoModal,
    handleCloseInfoModal,
}) => {
    const { t } = useTranslation();

    return (
        <InformationModal
            title={t("common.dashboard.informationModal.mosquitoMortalityOverTime.title")}
            years={years}
            openInfoModal={openInfoModal}
            handleCloseInfoModal={handleCloseInfoModal}
        >
            <Typography variant="body1">
                <Trans i18nKey="common.dashboard.informationModal.mosquitoMortalityOverTime.graphInterpretation" t={t}>
                    <strong>Graph interpretation:</strong> This bar chart displays the results of discriminating
                    concentration bioassays, grouped by insecticide or insecticide class (depending on the option
                    chosen). Bioassay results are categorized into three groups (confirmed resistance, possible
                    resistance and susceptibility to the tested insecticide).
                </Trans>
            </Typography>
            <Typography variant="body1">
                <Trans
                    i18nKey="common.dashboard.informationModal.mosquitoMortalityOverTime.typeOfResistance"
                    t={t}
                    shouldUnescape={true}
                    values={{ lessThan: escape("<") }}
                >
                    <strong>Type of resistance monitoring bioassay:</strong> Resistance to insecticides was determined
                    by mosquito mortality (CDC bottle bioassay, WHO tube test or WHO bottle bioassay). Confirmed
                    resistance is classified as mosquito mortality less 90%.
                </Trans>
            </Typography>
        </InformationModal>
    );
};

export default MosquitoMortalityOverTimePopup;
