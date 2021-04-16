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

export default () => {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b>
                    La détection d&apos;<i>An. stephensi</i> au Sri Lanka et dans la corne de l&apos;Afrique souligne le
                    potentiel de dissémination et d&apos;établissement des espèces vectrices dans des nouvelles zones
                    géographiques.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>
                    L&apos;invasion du nord du Brésil par <i>An. gambiae</i> en 1930 est un autre exemple. Son
                    éradication prouve que les invasions de vecteurs peuvent être résorbées.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <i>An. stephensi</i> est un vecteur de paludisme urbain très compétent, traditionnellement signalé dans
                certains pays d&apos;Asie du Sud-Est et dans la péninsule arabique. Depuis 2012, il a été détecté à
                Djibouti (2012), en Ethiopie (2016), au Sri Lanka (2017) et plus récemment en République du Soudan
                (2019, rapport non publié).
            </Typography>
            <br />
            <Typography variant={"body2"}>
                L&apos;invasion d&apos;<i>An. stephensi</i> a contribué à la résurgence du paludisme dans la ville de
                Djibouti. Au Sri Lanka, la récente invasion de ce vecteur pourrait compromettre les efforts visant à
                prévenir le rétablissement du paludisme. En Afrique, dans le contexte de l&apos;urbanisation rapide et
                incontrôlée, la propagation et l&apos;établissement d&apos;<i>An. stephensi</i> en milieu urbain
                pourraient mettre en péril les progrès réalisés depuis 2000 dans la réduction de la charge du paludisme.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <Link
                    href="https://www.who.int/publications/i/item/vector-alert-anopheles-stephensi-invasion-and-spread"
                    target="_blank"
                    color={"textSecondary"}
                >
                    <img src="https://apps.who.int/iris/rest/bitstreams/1283866/retrieve" alt="supporting" />
                </Link>
            </Typography>
        </div>
    );
};
