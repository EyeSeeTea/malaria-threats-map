import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles } from "@material-ui/core";

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
          Los parásitos de la malaria han desarrollado repetidamente resistencia
          al tratamiento antimalárico
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        <b>
          Durante décadas, la resistencia de los parásitos a los medicamentos ha
          sido uno de los principales obstáculos en la lucha contra la malaria.
        </b>
      </Typography>
      <br />
      <Typography variant={"body2"}>
        La vigilancia continua y notificación de la eficacia terapéutica y la
        resistencia de los parásitos a los antimaláricos, es fundamental para
        asegurar que los pacientes reciban un tratamiento eficaz. La OMS apoya a
        los programas nacionales de control de la malaria para vigilar la
        eficacia terapéutica de los antimaláricos y para rastrear los cambios
        genéticos relacionados con la resistencia a los medicamentos en los
        parásitos de la malaria.
      </Typography>
      <br />
      <Typography variant={"body2"}>
        El rol crítico que juega el control de la eficacia de los fármacos se ha
        observado en todo el mundo. La resistencia ha sido un reto persistente
        en la subregión del Gran Mekong. La región ha vigilado muy activamente
        la eficacia de estos fármacos.
      </Typography>
    </div>
  );
};
