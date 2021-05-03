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

export default function TreatmentFrenchStep1() {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b>
                    Les parasites du paludisme ont développé de manière successive une résistance au traitement
                    antipaludique
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>
                    Pendant des décennies, la résistance aux médicaments a été l&apos;un des principaux obstacles à la
                    lutte contre le paludisme.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                La surveillance continue et l&apos;information sur l&apos;efficacité du médicament et sur la résistance
                des parasites sont essentielles pour garantir aux patients un traitement efficace. L&apos;OMS soutient
                les programmes nationaux de lutte contre le paludisme afin de surveiller l&apos;efficacité du traitement
                antipaludique et de suivre les changements génétiques liés à la résistance aux médicaments chez les
                parasites du paludisme.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Le rôle crucial de la surveillance de l&apos;efficacité des médicaments a été observé dans le monde
                entier. La résistance a été un défi persistant dans la sous-région du Grand Mékong. La région a été très
                active dans la surveillance de l&apos;efficacité des médicaments.
            </Typography>
        </div>
    );
}
