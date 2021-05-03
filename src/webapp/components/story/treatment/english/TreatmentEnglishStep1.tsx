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

export default function TreatmentEnglishStep1() {
    const classes = useStyles({});
    return (
        <div>
            <Typography variant={"h6"} className={classes.title}>
                <b>Malaria parasites repeatedly develop resistance to antimalarial treatment</b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>For decades, drug resistance has been one of the main obstacles in the fight against malaria.</b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Continuous global monitoring and reporting of drug efficacy and parasite resistance is critical to
                ensure patients receive effective treatment. WHO supports national malaria control programmes to monitor
                antimalarial treatment efficacy and to track the genetic changes linked to drug resistance in malaria
                parasites.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                The critical role of monitoring drug efficacy has been observed worldwide. Resistance has been a
                persistent challenge in the Greater Mekong Subregion. The region has been very active in monitoring drug
                efficacy.
            </Typography>
        </div>
    );
}
