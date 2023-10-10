import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import { useTranslation, Trans } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import { useDashboards } from "../../pages/dashboards/context/useDashboards";

import { format } from "date-fns";
import { LastUpdatedDates } from "../../../domain/entities/LastUpdateDates";

export type SpecificInformationModalProps = Omit<InformationModalProps, "title">;

type InformationModalProps = {
    title: string;
    years: number[];
    openInfoModal: boolean;
    handleCloseInfoModal: () => void;
};

const InformationModal: React.FC<InformationModalProps> = ({
    title,
    years,
    openInfoModal,
    handleCloseInfoModal,
    children,
}) => {
    const { t } = useTranslation();
    const { theme, updatedDates } = useDashboards();

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
                    {children}
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
};

export default InformationModal;
