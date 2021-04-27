import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() =>
    createStyles({
        title: {
            lineHeight: 1.3,
        },
    })
);

export default function PBOFrenchStep2() {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b>Considérations pour le déploiement des moustiquaires imprégnées d’un pyréthrinoïde et de PBO</b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Le déploiement de moustiquaires imprégnées d’un pyréthrinoïde et de PBO ne doit être envisagé que dans
                les situations où la couverture par une outil de lutte antivectorielle efficace (principalement des
                MILDA ou des PID) ne sera pas réduite; l&apos;objectif principal doit rester la réalisation et le
                maintien d&apos;une couverture universelle pour toutes les personnes à risque de paludisme.
            </Typography>
            <br />
            <Typography variant={"body2"} className={classes.title}>
                Il faut évaluer leur déploiement zone par zone de relevance opérationnelle (par exemple districts ou
                provinces), en évaluant s&apos;ils satisfont les critères recommandés par l&apos;OMS, au lieu de les
                considérer pour le pays dans son ensemble. Le déploiement devrait être considéré dans le contexte de la
                disponibilité des ressources et l&apos;évaluer par rapport à d&apos;autres interventions de lutte contre
                le paludisme.
            </Typography>
            <br />
            <Typography variant={"body2"} className={classes.title}>
                Les moustiquaires aux pyréthroïdes-PBO ne doivent pas être considérées comme un outil capable lui seul
                de gérer efficacement la résistance aux insecticides chez les vecteurs du paludisme.
            </Typography>
        </div>
    );
}
