import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles } from "@material-ui/core";
import { useTranslation, Trans } from "react-i18next";

const useStyles = makeStyles(() =>
    createStyles({
        title: {
            lineHeight: 1.3,
        },
    })
);

export default () => {
    const classes = useStyles({});
    const { t } = useTranslation("treatment");

    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="step1.part1" t={t}>
                    <b>Malaria parasites repeatedly develop resistance to antimalarial treatment</b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step1.part2" t={t}>
                    <b>For decades, drug resistance has been one of the main obstacles in the fight against malaria.</b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>{t("step1.part3")}</Typography>
            <br />
            <Typography variant={"body2"}>{t("step1.part4")}</Typography>
        </div>
    );
};
