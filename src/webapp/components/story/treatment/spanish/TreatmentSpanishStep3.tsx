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

export default function TreatmentSpanishStep3() {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b>
                    Los estudios de marcadores moleculares proporcionan datos esenciales para la detección y seguimiento
                    de la resistencia a los medicamentos antimaláricos
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>
                    Los marcadores moleculares de la resistencia a fármacos son cambios genéticos en el parásito de la
                    malaria que se asocian con la resistencia a los antimaláricos
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                En comparación con los estudios de eficacia, los estudios de marcadores moleculares tienen varias
                ventajas prácticas, por ejemplo, se puede recoger y analizar rápidamente un gran número de muestras. Ya
                se han identificado marcadores moleculares de resistencia de <i>P. falciparum</i> a diferentes fármacos,
                incluyendo la cloroquina, piperaquina, mefloquina, pirimetamina, sulfadoxina, atovacuona y
                artemisininas.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                En el caso de las artemisininas, se ha encontrado varias mutaciones en el dominio de los propelentes de
                Kelch 13 (K13) que están asociadas con la desaparición retardada del parásito. Este es un campo en
                desarrollo, ya que se van descubriendo poco a poco más mutaciones del K13 y se va construyendo una mejor
                comprensión de las mutaciones que tienen mayor influencia en la resistencia.
            </Typography>
        </div>
    );
}
