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
          La detección oportuna de las especies de vectores invasoras es crucial
          para contener su propagación.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <b>
          Los sistemas de vigilancia entomológica proporcionan información
          crítica para el diseño e implementación de las estrategias de control
          vectorial.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        Para diseñar intervenciones efectivas que eviten una mayor propagación
        de las especies de vectores invasoras y su establecimiento en nuevas
        áreas geográficas, es necesario comprender los hábitats de reproducción
        y descanso de las especies de vectores, su comportamiento, sus
        preferencias alimenticias y su estado de resistencia.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        La OMS recomienda a todos los países endémicos realizar una vigilancia
        entomológica e informar a la OMS sobre la detección de especies
        sospechosas de ser invasoras completando, y enviando a{" "}
        <Link href="mailto:vectorsurveillance@who.int" color={"textSecondary"}>
          vectorsurveillance@who.int
        </Link>{" "}
        el
        <Link
          target="_blank"
          href="https://www.who.int/docs/default-source/documents/publications/gmp/whogmp-invasive-species-reporting-formd9410d7f2b424a04949a64b5e5f5fbd9.xlsm"
          color={"textSecondary"}
        >
          Formulario de la OMS para informar sobre la detección de las especies
          invasoras de vectores Anopheles
        </Link>
        .
      </Typography>
      <br />
      <Typography variant={"body2"}>
        KLos principales indicadores que deben ser monitoreados a través de la
        vigilancia entomológica pueden consultarse en el capítulo 5 del
        <Link
          target="_blank"
          href="https://www.who.int/malaria/publications/atoz/9789241565578/es/"
          color={"textSecondary"}
        >
          Manual de referencia para la vigilancia, el seguimiento y la
          evaluación de la malaria
        </Link>
        .
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <Link
          href="https://www.who.int/malaria/publications/atoz/9789241565578/es/"
          target="_blank"
          color={"textSecondary"}
        >
          <img
            src="https://www.who.int/malaria/publications/atoz/9789275320563_spa.pdf.jpg"
            alt="supporting Image"
          />
        </Link>
      </Typography>
    </div>
  );
};
