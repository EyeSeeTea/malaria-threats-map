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

export default function TreatmentSpanishStep2() {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b>
                    La vigilancia rutinaria de la eficacia de las terapias combinadas basadas en artemisinina (TCA) es
                    esencial para asegurar que los pacientes reciban un tratamiento eficaz
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>
                    La OMS recomienda que todos los países endémicos de malaria realicen estudios de eficacia
                    terapéutica al menos una vez cada dos años para informar sus directivas de tratamiento.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                La selección del medicamento antimaláricos se basa en la eficacia del medicamento contra el parásito de
                la malaria. Consecuentemente, el monitoreo de la eficacia terapéutica de los antimaláricos es un
                componente fundamental de las estrategias de tratamiento de la malaria. La OMS ha elaborado un protocolo
                estándar para medir la eficacia del tratamiento de los antimaláricos.
            </Typography>
        </div>
    );
}
