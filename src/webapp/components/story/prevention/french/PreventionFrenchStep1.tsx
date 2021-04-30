import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, Link, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      lineHeight: 1.3
    }
  })
);

export default () => {
  const classes = useStyles({});
  return (
    <div>
      <Typography variant={"h6"} className={classes.title}>
        <b>
          Le suivi de la résistance aux insecticides chez les vecteurs du
          paludisme est essentiel
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <b>
          Sur les 89 pays d’endémie palustre, 80 ont déclaré un suivi de la
          résistance aux insecticides entre 2010 et 2017. La quantité et la
          qualité des données varient selon les pays.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        La prévention du paludisme est essentiellement basée sur des outils qui
        ciblent les vecteurs : les moustiquaires imprégnées à longue durée
        d’action et les pulvérisations intra-domiciliaires. La résistance des
        moustiques aux insecticides est une préoccupation majeure, en
        particulier la résistance aux pyréthrinoïdes, car ils sont la seule
        classe d'insecticides actuellement approuvée pour l’imprégnation des
        moustiquaires.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Le Plan mondial de l'OMS pour la gestion de la résistance aux
        insecticides chez les vecteurs du paludisme (GPIRM) appelle à maintenir
        l'efficacité de la lutte antivectorielle. Le suivi de la résistance est
        nécessaire pour orienter les stratégies de réduction et de gestion de la
        résistance aux insecticides.
      </Typography>
      <br />
      <Link
        href="https://www.who.int/malaria/publications/atoz/gpirm/fr/"
        target="_blank"
        color={"textSecondary"}
      >
        <img
          src="https://www.who.int/entity/malaria/publications/atoz/plan_paludisme_resistance_insecticide.jpg"
          alt="supporting"
        />
      </Link>
    </div>
  );
};
