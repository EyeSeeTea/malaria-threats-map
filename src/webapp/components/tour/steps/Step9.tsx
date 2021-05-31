import { Typography } from "@material-ui/core";
import React from "react";
import { Footer, StepProps } from "../MalariaTour";
import { useTranslation } from "react-i18next";

export default function Step9(options: StepProps) {
    const { t } = useTranslation();
    return (
        <>
            <>
                <Typography variant="body2">{t("tour.steps.9.p1")}</Typography>
            </>
            <Footer {...options} current={10} total={10} />
        </>
    );
}
