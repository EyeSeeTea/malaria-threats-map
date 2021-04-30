import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Link } from "@material-ui/core";

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
          Moustiquaires imprégnées d’un pyréthrinoïde et de PBO préqualifiés par
          la OMS
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Le processus de préqualification de l'OMS évalue les produits de lutte
        antivectorielle pour leur sécurité, leur qualité et leur efficacité
        entomologique par rapport aux normes d'évaluation publiées. Les nouveaux
        types de MILDA actuellement préqualifiés ont démontré qu'ils sont sûrs
        et efficaces pour l'usage auquel ils sont destinés.
      </Typography>
      <br />
      <Typography variant={"body2"} className={classes.title}>
        La liste des moustiquaires pyréthroïdes-PBO préqualifiées par l'OMS peut
        être consultée sur le site:{" "}
        <Link
          href={"https://www.who.int/pq-vector-control/prequalified-lists/en/"}
          target={"_blank"}
        >
          https://www.who.int/pq-vector-control/prequalified-lists/en/
        </Link>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        La durée du synergiste de butoxyde de pipéronyle (PBO) imprégné dans le
        matériau des moustiquaires n'est pas encore connue.
      </Typography>
      <br />
      <Typography variant={"body2"} className={classes.title}>
        Pour plus d'informations sur les moustiquaires pyréthroïdes-PBO et leur
        différence avec les moustiquaires de pyréthroïdes uniquement, veuillez
        consulter:{" "}
        <Link
          href={
            "https://www.who.int/news-room/q-a-detail/new-types-of-insecticide-treated-nets"
          }
          target={"_blank"}
        >
          https://www.who.int/news-room/q-a-detail/new-types-of-insecticide-treated-nets
        </Link>
      </Typography>
    </div>
  );
};
