import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, Link, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() =>
    createStyles({
        title: {
            lineHeight: 1.3,
        },
    })
);

export default function InvasiveEnglishStep3() {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b>
                    Les stratégies de lutte devraient s&apos;inspirer des meilleures pratiques d&apos;autres pays, faire
                    l&apos;objet d&apos;un suivi et d&apos;une évaluation adéquats et être modifiées au besoin.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>
                    Les espèces vectrices invasives peuvent s&apos;adapter à leur nouvel environnement en modifiant
                    leurs comportements traditionnels et peuvent devenir résistantes aux insecticides lorsqu&apos;elles
                    sont exposées aux outils de lutte antivectorielle.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                En raison des ces potentiels changements de comportement adaptatifs des espèces vectrices, les
                programmes devraient continuellement surveiller et évaluer l&apos;efficacité des interventions de lutte
                antivectorielle déployées afin d&apos;opérer les ajustements stratégiques nécessaires.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                L&apos;OMS recommande aux programmes nationaux de lutte contre le paludisme, et à leurs partenaires
                exécutifs, de consigner les enseignements retenus et de les communiquer à l&apos;OMS (
                <Link href="mailto:vectorsurveillance@who.int" color={"textSecondary"}>
                    vectorsurveillance@who.int
                </Link>
                ) afin de contribuer à l&apos;élaboration de plan fondé sur des données probantes en matière de lutte et
                d&apos;éradication des espèces vectrices et invasives du paludisme.
            </Typography>
        </div>
    );
}
