import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, Link, makeStyles } from "@material-ui/core";
import image1 from "../../../assets/img/pbo_page_1_1.png";
import image2 from "../../../assets/img/pbo_page_1_2.png";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";

const useStyles = makeStyles(() =>
    createStyles({
        title: {
            lineHeight: 1.3,
        },
    })
);

const Images = styled.div`
    display: flex;
    justify-content: space-between;
`;

export default () => {
    const classes = useStyles({});
    const { t } = useTranslation("pbo");

    return (
        <div>
            <Typography variant={"body1"} className={classes.title}>
                <Trans i18nKey="step1.part1" t={t}>
                    <b>What are Pyrethroid-PBO nets?</b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>{t("step1.part2")}</Typography>
            <br />
            <Typography variant={"body1"} className={classes.title}>
                <Trans i18nKey="step1.part3" t={t}>
                    <b>Are they recommended by WHO as a public health intervention? </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>{t("step1.part4")}</Typography>
            <br />
            <Typography variant={"body2"}>{t("step1.part5")}</Typography>
            <br />
            <Images>
                <Link
                    href="https://apps.who.int/iris/bitstream/handle/10665/310862/9789241550499-eng.pdf?ua=1"
                    target="_blank"
                    color={"textSecondary"}
                >
                    <img src={image1} alt="pbo 1" width={150} />
                </Link>
                <Link
                    href="https://apps.who.int/iris/bitstream/handle/10665/258939/WHO-HTM-GMP-2017.17-eng.pdf?sequence=5"
                    target="_blank"
                    color={"textSecondary"}
                >
                    <img src={image2} alt="pbo 2" width={150} />
                </Link>
            </Images>
        </div>
    );
};
