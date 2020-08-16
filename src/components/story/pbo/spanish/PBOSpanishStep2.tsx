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
          Consideraciones para el despliegue de mosquiteros con piretroide y BOP
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        El despliegue de <b>mosquiteros con piretroide y BOP</b> solo debe
        considerarse si no se hace a expensas de una reducción en la cobertura
        del control vectorial con otras herramientas eficaces (principalmente
        MILD o PID); el objetivo principal debe seguir siendo siempre el logro y
        el mantenimiento de la cobertura universal para todas las personas en
        riesgo de contraer paludismo.
      </Typography>
      <br />
      <Typography variant={"body2"} className={classes.title}>
        Su despliegue debe considerarse zona por zona (por ejemplo, distritos o
        provincias) evaluado si cada una de ellas cumplen los criterios
        recomendados por la OMS; en lugar de desplegarse en el país completo. Es
        importante considerar su despliegue en el contexto de la disponibilidad
        de recursos y evaluándolo frente a otras intervenciones de control de la
        malaria.
      </Typography>
      <br />
      <Typography variant={"body2"} className={classes.title}>
        Los mosquiteros con piretroide no deben considerarse como una
        herramienta que por sí sola consiga controlar eficazmente la resistencia
        a los insecticidas en los vectores de la malaria.
      </Typography>
    </div>
  );
};
