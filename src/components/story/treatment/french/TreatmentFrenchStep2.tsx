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

export default () => {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b>
                    La surveillance systématique de l&apos;efficacité des thérapies combinées à base d&apos;artémisinine
                    (ACT) est essentielle pour s&apos;assurer que les patients reçoivent un traitement efficace
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>
                    L&apos;OMS recommande que tous les pays où le paludisme est endémique effectuent des études
                    d&apos;efficacité thérapeutique au moins une fois tous les deux ans pour informer la politique de
                    traitement.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                La sélection du médicament antipaludique recommandé repose sur l&apos;efficacité du médicament contre le
                parasite du paludisme. Par conséquent, le suivi de l&apos;efficacité thérapeutique des médicaments
                antipaludiques est un élément fondamental des stratégies de traitement du paludisme. L&apos;OMS a
                élaboré un protocole standard pour la surveillance de l&apos;efficacité du traitement antipaludique.
            </Typography>
        </div>
    );
};
