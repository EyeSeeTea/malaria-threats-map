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
          El aumento de la resistencia resalta la necesidad urgente de mejorar
          la vigilancia de la resistencia a los insecticidas
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <b>
          Los vectores de malaria en algunas zonas de África están sobreviviendo
          a la exposición a altas concentraciones de insecticidas, lo que indica
          una resistencia de una intensidad cada vez mayor.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Las pruebas de resistencia miden el número de mosquitos que sobreviven a
        la exposición a una concentración estándar de insecticida. Sin embargo,
        conocer la intensidad de la resistencia en los sobrevivientes y los
        mecanismos que confieren esta resistencia es importante. La resistencia
        de alta intensidad pone de manifiesto la necesidad de una acción urgente
        que debe guiarse por el conocimiento de los mecanismos de resistencia
        presentes.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Los procedimientos para las pruebas de la OMS se ampliaron recientemente
        para incluir bioensayos que miden la intensidad de la resistencia y la
        implicación de los mecanismos metabólicos.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <Link
          href="https://www.who.int/malaria/publications/atoz/9789241511575/es/"
          target="_blank"
          color={"textSecondary"}
        >
          <img
            src="https://www.who.int/entity/malaria/publications/atoz/9789243511573_es.JPG"
            alt="supporting"
          />
        </Link>
      </Typography>
    </div>
  );
};
