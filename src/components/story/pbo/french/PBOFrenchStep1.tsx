import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, Link, makeStyles } from "@material-ui/core";
import image1 from "../../../../assets/img/pbo_page_1_1.png";
import image2 from "../../../../assets/img/pbo_page_1_2.png";
import styled from "styled-components";

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
    return (
        <div>
            <Typography variant={"body1"} className={classes.title}>
                <b>Que sont les moustiquaires imprégnées d’un pyréthrinoïde et de PBO?</b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Les moustiquaires imprégnées d’un pyréthrinoïde et de PBO sont des moustiquaires contenant à la fois un
                insecticide pyréthrinoïde et le synergiste PBO. Le PBO agit en inhibant certaines enzymes métaboliques
                dans le moustique (par exemple les oxydases à fonctions mixtes) qui détoxifient ou séquestrent les
                insecticides avant qu&apos;ils puissent avoir un effet toxique sur le moustique.
            </Typography>
            <br />
            <Typography variant={"body1"} className={classes.title}>
                <b>Sont-ils recommandés par l&apos;OMS comme intervention de santé publique? </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Les moustiquaires imprégnées d’un pyréthrinoïde et de PBO préqualifiées par l’OMS font l’objet d’une
                recommandation soumise à conditions : elles peuvent être déployées à la place des moustiquaires à
                imprégnation durable traitées par un pyréthrinoïde uniquement lorsque le principal ou les principaux
                vecteur(s) du paludisme présente(nt) une résistance aux pyréthrinoïdes qui est : a) confirmée, b) de
                niveau intermédiaire et c) due (au moins en partie) à un mécanisme de résistance impliquant les
                monooxygénases, déterminé par les procédures standard.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Cette recommandation a été exceptionnellement accordée en 2017 sur la base des données épidémiologiques
                d&apos;un ECR en cluster et restera conditionnelle jusqu&apos;à ce que les données d&apos;au moins un
                autre essai, mené sur 2 ans, aient confirmé le même impact sur le paludisme qui a été démontré par le
                première étude.
            </Typography>
            <br />
            <Images>
                <Link
                    href="https://apps.who.int/iris/bitstream/handle/10665/328164/9789242550498-fre.pdf"
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
