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

const PBOStep1 = () => {
    const classes = useStyles({});
    const { t } = useTranslation("pbo");

    return (
        <div>
            <Typography variant={"body1"} className={classes.title}>
                <Trans i18nKey="step1.part1">
                    <b>What are Pyrethroid-PBO nets?</b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step1.part2" t={t}>
                    Pyrethroid PBO nets are mosquito nets that include both a pyrethroid insecticide and the synergist
                    PBO. PBO acts by inhibiting certain metabolic enzymes (e.g. mixed-function oxidases) within the
                    mosquito that detoxify or sequester insecticides before they can have a toxic effect on the
                    mosquito.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body1"} className={classes.title}>
                <Trans i18nKey="step1.part3">
                    <b>Are they recommended by WHO as a public health intervention? </b>
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step1.part4" t={t}>
                    Pyrethroid-PBO nets prequalified by WHO are conditionally recommended for deployment instead of
                    pyrethroid-only LLINs where the principal malaria vector(s) exhibit pyrethroid resistance that is:
                    a) confirmed, b) of intermediate level, and c) conferred (at least in part) by a monooxygenase-based
                    resistance mechanism, as determined by standard procedures.
                </Trans>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Trans i18nKey="step1.part5" t={t}>
                    This recommendation was exceptionally granted in 2017 based on the epidemiological data from one
                    cluster RCT and will remain conditional until data from at least one more trial conducted over 2
                    years have confirmed the enhanced impact on malaria that was demonstrated in the first study.
                </Trans>
            </Typography>
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

export default PBOStep1;
