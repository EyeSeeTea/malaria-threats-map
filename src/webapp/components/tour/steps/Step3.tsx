import { Typography } from "@mui/material";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";
import { useTranslation } from "react-i18next";

export default function Step3(options: StepProps) {
    const { t } = useTranslation();
    return (
        <>
            <>
                <Typography variant="subtitle1">
                    <strong>{t("tour.steps.3.title")}</strong>
                </Typography>
            </>
            <Footer {...options} current={3} total={5} />
        </>
    );
}
