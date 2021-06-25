import { Typography } from "@material-ui/core";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";
import { useTranslation } from "react-i18next";

export default function Step4(options: StepProps) {
    const { t } = useTranslation();
    return (
        <>
            <>
                <Typography variant="body2">{t("tour.steps.4.p1")}</Typography>
            </>
            <Footer {...options} current={4} total={10} />
        </>
    );
}
