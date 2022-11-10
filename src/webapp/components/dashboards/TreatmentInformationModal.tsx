import React from "react";
import { Typography } from "@mui/material";
import { useTranslation, Trans } from "react-i18next";
import InformationModal from "./InformationModal";

type InformationModalProps = {
    title: string;
    years: number[];
    type: string;
    openInfoModal: boolean;
    handleCloseInfoModal: () => void;
};

const TreatmentFailureByDrugContent = () => {
    const { t } = useTranslation();
    return (
        <>
            <Typography variant="body1">
                <Trans
                    i18nKey="common.dashboard.informationModal.summaryTreatmentFailureRateByDrug.chartInterpretation"
                    t={t}
                    shouldUnescape={true}
                    values={{ lessThen: escape("<") }}
                ></Trans>
            </Typography>
            <Typography variant="body1">
                <Trans
                    i18nKey="common.dashboard.informationModal.summaryTreatmentFailureRateByDrug.dataAvailability"
                    t={t}
                >
                    <strong>Data availability:</strong> All studies for which data are available are shown.
                </Trans>
            </Typography>
            <Typography variant="body1">
                <Trans i18nKey="common.dashboard.informationModal.common.studyProtocol" t={t}>
                    <strong>Study protocol:</strong> WHO recommends that all therapeutic efficacy studies are conducted
                    according to the WHO. standard protocol.
                </Trans>
            </Typography>
            <Typography variant="body1">{t("common.dashboard.informationModal.common.info")}</Typography>
        </>
    );
};
const TreatmentFailureContent = () => {
    const { t } = useTranslation();
    return (
        <>
            <Typography variant="body1">
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
            <Typography variant="body1">
                {t("common.dashboard.informationModal.treatmentFailureRateOverTime.description_1")}
            </Typography>
            <Typography variant="body1">
                {t("common.dashboard.informationModal.treatmentFailureRateOverTime.description_2")}
            </Typography>
            <Typography variant="body1">
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
            <Typography variant="body1">
                <Trans i18nKey="common.dashboard.informationModal.common.studyProtocol" t={t}>
                    <strong>Study protocol:</strong> WHO recommends that all therapeutic efficacy studies are conducted
                    according to the WHO standard protocol.
                </Trans>
            </Typography>
            <Typography variant="body1">{t("common.dashboard.informationModal.common.info")}</Typography>
        </>
    );
};
const ParasiteClearanceContent = () => {
    const { t } = useTranslation();
    return (
        <>
            <Typography variant="body1">
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
            <Typography variant="body1">
                {t("common.dashboard.informationModal.parasiteClearanceRatesOverTime.description_1")}
            </Typography>
            <Typography variant="body1">
                {t("common.dashboard.informationModal.parasiteClearanceRatesOverTime.description_2")}
            </Typography>
            <Typography variant="body1">
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
            <Typography variant="body1">
                <Trans i18nKey="common.dashboard.informationModal.common.studyProtocol" t={t}>
                    <strong>Study protocol:</strong> WHO recommends that all therapeutic efficacy studies are conducted
                    according to the WHO. standard protocol.
                </Trans>
            </Typography>
            <Typography variant="body1">{t("common.dashboard.informationModal.common.info")}</Typography>
        </>
    );
};
const MolecularMarkerStudyContent = () => {
    const { t } = useTranslation();
    return (
        <>
            <Typography variant="body1">
                {t("common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.intro")}
            </Typography>
            <Typography variant="body1">
                <Trans
                    i18nKey="common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.chartInterpretation"
                    t={t}
                >
                    <strong>Chart interpretation:</strong> This stacked bar chart displays the molecular marker study
                    results. The height of the bar is determined by the number of studies conducted in that year.
                </Trans>
            </Typography>
            <Typography variant="body1">
                <Typography fontStyle={"italic"} color="#2FB3AF" fontWeight={"bold"} display="inline">
                    Pfkelch13:
                </Typography>{" "}
                <Typography display="inline">
                    {t("common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.pfkelch13.description")}
                </Typography>
                <ul>
                    <li>
                        {t("common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.pfkelch13.list_1")}
                    </li>
                    <li>
                        {t("common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.pfkelch13.list_2")}
                    </li>
                </ul>
            </Typography>
            <Typography variant="body1">
                <Typography fontStyle={"italic"} color="#2FB3AF" fontWeight={"bold"} display="inline">
                    Pfcrt:
                </Typography>{" "}
                <Typography display="inline">
                    {t("common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.pfcrt")}
                </Typography>
            </Typography>
            <Typography variant="body1">
                <Typography fontStyle={"italic"} color="#2FB3AF" fontWeight={"bold"} display="inline">
                    Pfmdr1
                </Typography>
                <Typography display="inline">{t("common.dashboard.informationModal.common.and")} </Typography>
                <Typography fontStyle={"italic"} color="#2FB3AF" fontWeight={"bold"} display="inline">
                    Pfplasmepsin 2-3:
                </Typography>{" "}
                <Typography display="inline">
                    {t("common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.pfmdr1")}
                </Typography>
            </Typography>
            <Typography variant="body1">
                <Trans
                    i18nKey="common.dashboard.informationModal.summaryMolecularMarkerStudyOverTime.dataAvailability"
                    t={t}
                >
                    <strong>Data availability:</strong> All studies for which data are available are shown.
                </Trans>
            </Typography>
            <Typography variant="body1">{t("common.dashboard.informationModal.common.info")}</Typography>
        </>
    );
};

export default function TreatmentInformationModal({
    title,
    type,
    years,
    openInfoModal,
    handleCloseInfoModal,
}: InformationModalProps): JSX.Element {
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
        <InformationModal
            title={title}
            years={years}
            openInfoModal={openInfoModal}
            handleCloseInfoModal={handleCloseInfoModal}
        >
            <ModalContent />
        </InformationModal>
    );
}
