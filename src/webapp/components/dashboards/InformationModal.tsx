import React from "react";
import { IconButton, Modal, Paper, Stack, Typography } from "@mui/material";
import { useTranslation, Trans } from "react-i18next";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { escape } from "lodash";

type InformationModalProps = {
    title: string;
    years: number[];
    type: string;
    openInfoModal: boolean;
    handleCloseInfoModal: () => void;
};

const InfoModal = styled(Paper)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: medium;
    border-width: 0px;
    padding: 60px 100px;
    border-color: black;
    @media (max-width: 1440px) {
        width: 70vw;
    }
    @media (max-width: 1024px) {
        padding: 40px 60px;
        width: 80vw;
    }
    @media (max-width: 768px) {
        padding: 20px 30px;
        width: 80vw;
    }
`;

const TreatmentFailureByDrugContent = () => {
    const { t } = useTranslation();
    return (
        <>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                <Trans
                    i18nKey="common.dashboard.informationModal.summaryTreatmentFailureRateByDrug.chartInterpretation"
                    t={t}
                    shouldUnescape={true}
                    values={{ lessThen: escape("<") }}
                ></Trans>
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                <Trans
                    i18nKey="common.dashboard.informationModal.summaryTreatmentFailureRateByDrug.dataAvailability"
                    t={t}
                >
                    <strong>Data availability:</strong> All studies for which data are available are shown.
                </Trans>
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                <Trans i18nKey="common.dashboard.informationModal.common.studyProtocol" t={t}>
                    <strong>Study protocol:</strong> WHO recommends that all therapeutic efficacy studies are conducted
                    according to the WHO. standard protocol.
                </Trans>
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                {t("common.dashboard.informationModal.common.info")}
            </Typography>
        </>
    );
};
const TreatmentFailureContent = () => {
    const { t } = useTranslation();
    return (
        <>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                <Trans
                    i18nKey="common.dashboard.informationModal.treatmentFailureRateOverTime.chartInterpretation"
                    t={t}
                >
                    <strong>Chart interpretation:</strong> This scatter plot displays the percentage of patients with
                    treatment failure, in a therapeutic efficacy study conducted in a selected country (or countries),
                    by year. The user can customize the chart by selecting a Plasmodium species, a drug, and the years
                    of interest. The user can also exclude studies with less than 20 patients from the chart.
                </Trans>
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                {t("common.dashboard.informationModal.treatmentFailureRateOverTime.description_1")}
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                {t("common.dashboard.informationModal.treatmentFailureRateOverTime.description_2")}
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                <Trans i18nKey="common.dashboard.informationModal.treatmentFailureRateOverTime.dataAvailability" t={t}>
                    <strong>Data availability:</strong> Only data for{" "}
                    <strong>
                        <i>P. falciparum</i>
                    </strong>{" "}
                    and{" "}
                    <strong>
                        <i>P. vivax</i>
                    </strong>{" "}
                    are displayed in this graph.
                </Trans>
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                <Trans i18nKey="common.dashboard.informationModal.common.studyProtocol" t={t}>
                    <strong>Study protocol:</strong> WHO recommends that all therapeutic efficacy studies are conducted
                    according to the WHO standard protocol.
                </Trans>
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                {t("common.dashboard.informationModal.common.info")}
            </Typography>
        </>
    );
};
const ParasiteClearanceContent = () => {
    const { t } = useTranslation();
    return (
        <>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                <Trans
                    i18nKey="common.dashboard.informationModal.parasiteClearanceRatesOverTime.chartInterpretation"
                    t={t}
                >
                    <strong>Chart interpretation:</strong> This scatter plot displays the percentage of patients with
                    delayed parasite clearance, in a therapeutic efficacy study, conducted in a selected country (or
                    countries), by year. The user can customize the chart by selecting a Plasmodium species, a drug, and
                    the years of interest. The user can also exclude studies with less than 20 patients from the chart.
                </Trans>
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                {t("common.dashboard.informationModal.parasiteClearanceRatesOverTime.description_1")}
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                {t("common.dashboard.informationModal.parasiteClearanceRatesOverTime.description_2")}
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                <Trans
                    i18nKey="common.dashboard.informationModal.parasiteClearanceRatesOverTime.dataAvailability"
                    t={t}
                >
                    <strong>Data availability:</strong> Only data for{" "}
                    <strong>
                        <i>P. falciparum</i>
                    </strong>{" "}
                    and{" "}
                    <strong>
                        <i>P. vivax</i>
                    </strong>{" "}
                    are displayed in this graph.
                </Trans>
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                <Trans i18nKey="common.dashboard.informationModal.common.studyProtocol" t={t}>
                    <strong>Study protocol:</strong> WHO recommends that all therapeutic efficacy studies are conducted
                    according to the WHO. standard protocol.
                </Trans>
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                {t("common.dashboard.informationModal.common.info")}
            </Typography>
        </>
    );
};
const MolecularMarkerStudyContent = () => {
    const { t } = useTranslation();
    return (
        <>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                {t("common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.intro")}
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                <Trans
                    i18nKey="common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.chartInterpretation"
                    t={t}
                >
                    <strong>Chart interpretation:</strong> This stacked bar chart displays the molecular marker study
                    results. The height of the bar is determined by the number of studies conducted in that year.
                </Trans>
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                <Typography fontStyle={"italic"} color="#2FB3AF">
                    Pfkelch13:
                </Typography>{" "}
                {t("common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.pfkelch13.description")}
                <ul>
                    <li>
                        {t("common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.pfkelch13.list_1")}
                    </li>
                    <li>
                        {t("common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.pfkelch13.list_2")}
                    </li>
                </ul>
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                <Typography fontStyle={"italic"} color="#2FB3AF">
                    Pfcrt:
                </Typography>{" "}
                {t("common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.pfcrt")}
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                <Typography fontStyle={"italic"} color="#2FB3AF">
                    Pfmdr1
                </Typography>{" "}
                {t("common.dashboard.informationModal.common.and")}{" "}
                <Typography fontStyle={"italic"} color="#2FB3AF">
                    Pfplasmepsin 2-3:
                </Typography>{" "}
                {t("common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.pfmdr1.description")}
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                <Trans
                    i18nKey="common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.dataAvailability"
                    t={t}
                >
                    <strong>Data availability:</strong> All studies for which data are available are shown.
                </Trans>
            </Typography>
            <Typography fontSize={{ xs: "11px", md: "15px" }}>
                {t("common.dashboard.informationModal.common.info")}
            </Typography>
        </>
    );
};

export default function InformationModal({
    title,
    type,
    years,
    openInfoModal,
    handleCloseInfoModal,
}: InformationModalProps): JSX.Element {
    const { t } = useTranslation();

    const ModalContent = () => {
        switch (type) {
            case "treatmentFailureByDrug":
                return <TreatmentFailureByDrugContent />;
            case "treatmentFailure":
                return <TreatmentFailureContent />;
            case "positiveDay3":
                return <ParasiteClearanceContent />;
            case "molecularMarkerStudy":
                return <MolecularMarkerStudyContent />;
        }
    };

    return (
        <Modal
            open={openInfoModal}
            onClose={handleCloseInfoModal}
            aria-labelledby="info-modal"
            aria-describedby="adicional-info-modal"
        >
            <InfoModal>
                <Typography
                    id="modal-modal-title"
                    variant="h5"
                    component="h2"
                    color="#2BA681"
                    textTransform={"uppercase"}
                    fontWeight="medium"
                    fontSize={{ xs: "15px", sm: "23px", md: "29px" }}
                >
                    {title}
                </Typography>
                <IconButton
                    size={"small"}
                    onClick={handleCloseInfoModal}
                    sx={{ position: "absolute", top: "10px", right: "20px" }}
                >
                    <CloseIcon />
                </IconButton>
                <Stack mt={3} gap={{ xs: 1, md: 3 }}>
                    <ModalContent />
                    <hr style={{ width: "100%" }}></hr>
                    <Stack>
                        <Typography fontSize={{ xs: "11px", md: "15px" }}>
                            <Trans i18nKey="common.dashboard.informationModal.common.dataPeriod" t={t}>
                                <strong>Data period:</strong>
                            </Trans>{" "}
                            {years[0]}-{years[1]}
                        </Typography>
                        <Typography fontSize={{ xs: "11px", md: "15px" }}>
                            <Trans i18nKey="common.dashboard.informationModal.common.dataLastUpdated" t={t}>
                                <strong>Data last updated:</strong>
                            </Trans>{" "}
                            05/11/2021
                        </Typography>
                    </Stack>
                </Stack>
            </InfoModal>
        </Modal>
    );
}
