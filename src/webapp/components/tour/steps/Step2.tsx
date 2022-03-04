import { Typography } from "@mui/material";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";
import { useTranslation } from "react-i18next";

export default function Step2(options: StepProps) {
    const { t } = useTranslation();
    return (
        <>
            <>
                <Typography variant="subtitle1">
                    <strong>{t("tour.steps.2.title")}</strong>
                </Typography>
            </>
            <Footer {...options} current={2} total={10} />
        </>
    );
}
