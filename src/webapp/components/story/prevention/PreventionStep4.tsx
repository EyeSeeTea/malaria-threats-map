import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, Link, makeStyles } from "@material-ui/core";
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
    const { t } = useTranslation("prevention");

    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="step4.part1" t={t}>
                    <b>Increasing resistance underscores the urgent need for enhanced monitoring</b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step4.part2" t={t}>
                    <b>
                        Malaria vectors in some areas of Africa can now survive exposure to high concentrations of
                        insecticides, indicating intensified resistance.
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>{t("step4.part3")}</Typography>
            <br />
            <Typography variant={"body2"}>{t("step4.part4")}</Typography>
            <br />
            <Link href="https://www.who.int/publications/i/item/9789241511575" target="_blank" color={"textSecondary"}>
                <img
                    src="https://www.who.int/entity/malaria/publications/atoz/9789241511575_eng.JPG"
                    alt={t("step4.prevention4")}
                />
            </Link>
        </div>
    );
};
