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

export default function DiagnosisSpanishStep3() {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b>
                    Una mayor vigilancia de las supresiones del gen <i>pfhrp2/3</i> entre las poblaciones de{" "}
                    <i>P. falciparum</i> es esencial
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Una vez que se confirman las supresiones en una región geográfica, deben realizarse estudios localmente
                y en zonas vecinas para estimar la prevalencia de los parásitos con supresión del gen. En contextos
                clínicos, es importante investigar la causa o causas de los falsos negativos en las PDR.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                La vigilancia centinela debe ser diseñada para reportar los hallazgos tanto positivos como negativos.
                Los datos deben gestionarse bien para ayudar a priorizar los estudios, analizar adecuadamente las
                tendencias a lo largo del tiempo e informar una respuesta coordinada a esta amenaza.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                A partir de 2017, la base de datos de la OMS incluye datos de supresión de genes pfhrp2/3para 29 países
                en 5 de las regiones de la OMS.
            </Typography>
        </div>
    );
}
