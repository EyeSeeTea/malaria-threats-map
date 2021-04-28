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
    const { t } = useTranslation("pbo");

    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="step2.part1" t={t}>
                    <b>Considerations for the deployment of Pyrethroid-PBO nets</b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>{t("step2.part2")}</Typography>
            <br />
            <Typography variant={"body2"} className={classes.title}>
                {t("step2.part3")}
            </Typography>
            <br />
            <Typography variant={"body2"} className={classes.title}>
                {t("step2.part4")}
            </Typography>
        </div>
    );
};
