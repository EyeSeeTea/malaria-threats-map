import { Typography } from "@mui/material";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";
import { useTranslation } from "react-i18next";

export default function Step7(options: StepProps) {
    const { t } = useTranslation();
    return (
        <>
            <>
                <Typography variant="body2">{t("tour.steps.7.p1")}</Typography>
            </>
            <Footer {...options} current={8} total={10} />
        </>
    );
}
