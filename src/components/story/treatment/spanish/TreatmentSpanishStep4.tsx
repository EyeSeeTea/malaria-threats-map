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
const TreatmentSpanishStep4 = () => {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b>
                    La resistencia a los fármacos es un desafío tanto en <i>P. vivax</i> como en
                    <i>P. falciparum</i>, las dos especies más comunes de parásitos de la malaria humana
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>
                    Es critico contar con información actualizada sobre la resistencia a fármacos para ambos parásitos
                    de la malaria
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Las terapias combinadas basadas en la artemisinina son el tratamiento recomendado para el parásito más
                mortal de la malaria, <i>P. falciparum</i>. Existen dos indicadores clave para vigilar la eficacia de
                las TCA: (1) la proporción de tratamientos fallidos y (2) la proporción de pacientes que presenta
                parásitos al tercer día después del inicio del tratamiento. Un aumento en la proporción de pacientes con
                parásitos al tercer día es un signo que advierte de la potencial existencia de resistencia a la
                artemisinina.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                La cloroquina se sigue utilizando en muchos lugares para tratar la malaria por <i>P. vivax</i>. Sin
                embargo, como la resistencia a la cloroquina también se está desarrollando en este parásito, algunos
                países han comenzado a utilizar TCA para el tratamiento de la malaria por <i>P. vivax</i>.
            </Typography>
        </div>
    );
};
export default TreatmentSpanishStep4;
