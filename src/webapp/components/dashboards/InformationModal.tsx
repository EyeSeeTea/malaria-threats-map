import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import { useTranslation, Trans } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import { escape } from "lodash";
import { useDashboards } from "../../pages/dashboards/context/useDashboards";
import { LastUpdatedDates } from "../../store/types";
import { format } from "date-fns";

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

export default function InformationModal({
    title,
    type,
    years,
    openInfoModal,
    handleCloseInfoModal,
}: InformationModalProps): JSX.Element {
    const { t } = useTranslation();
    const { theme, updatedDates } = useDashboards();

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
        <Dialog
            open={openInfoModal}
            onClose={handleCloseInfoModal}
            aria-labelledby="info-modal"
            aria-describedby="adicional-info-modal"
            sx={{ marginTop: 4 }}
            maxWidth="lg"
        >
            <DialogTitle id="responsive-dialog-title" sx={{ paddingLeft: 10, paddingRight: 10, paddingTop: 10 }}>
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
            </DialogTitle>

            <DialogContent sx={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
                <Stack mt={3} gap={{ xs: 1, md: 3 }}>
                    <ModalContent />
                    <hr style={{ width: "100%" }}></hr>
                    <Stack>
                        <Typography variant="body1">
                            <Trans i18nKey="common.dashboard.informationModal.common.dataPeriod" t={t}>
                                <strong>Data period:</strong>
                            </Trans>
                            {years[0]}-{years[1]}
                        </Typography>
                        <Typography variant="body1">
                            <Trans i18nKey="common.dashboard.informationModal.common.dataLastUpdated" t={t}>
                                <strong>Data last updated:</strong>
                            </Trans>
                            {format(updatedDates[theme as keyof LastUpdatedDates], "dd/MM/yyyy")}
                        </Typography>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
