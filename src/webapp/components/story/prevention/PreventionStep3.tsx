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

const PreventionStep3 = () => {
    const classes = useStyles({});
    const { t } = useTranslation("prevention");

    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <Trans i18nKey="step3.part1" t={t}>
                    <b>Recent and complete data on insecticide resistance are lacking for many countries</b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step3.part2" t={t}>
                    <b>
                        47 of 89 malaria-endemic countries reported data for 2017. There are relatively few data in
                        regions other than Africa, such as South-East Asia. Monitoring often does not include all major
                        vector species and all relevant insecticide classes.
                    </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>{t("step3.part3")}</Typography>
            <br />
            <Typography variant={"body2"}>{t("step3.part4")}</Typography>
            <br />
            <Link href="https://www.who.int/publications/i/item/9789241512138" target="_blank" color={"textSecondary"}>
                <img
                    src="https://www.who.int/malaria/publications/atoz/9789241512138_eng.JPG"
                    alt={t("step3.prevention3")}
                />
            </Link>
        </div>
    );
};

export default PreventionStep3;