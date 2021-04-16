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
                    Drug resistance is a challenge in both <i>P. vivax</i> and <i>P. falciparum</i>, the two most common
                    human malaria parasite species
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>
                    Up-to-date information on drug resistance for both <i>P. vivax</i> and <i>P. falciparum</i> malaria
                    is critical.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Artemisinin-based combination therapies (ACTs) are the recommended treatment for the most deadly malaria
                parasite, <i>P. falciparum</i>. There are two key outcome measures for monitoring the efficacy of ACTs:
                (1) the proportion of treatment failures and, (2) the proportion of patients with parasites on the third
                day after starting treatment. An increase in the proportion of patients with parasites on day 3 is a
                warning sign of artemisinin resistance.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Chloroquine is still used in many places to treat <i>P. vivax</i> malaria. However, as chloroquine
                resistance is also developing in <i>P. vivax</i> parasites, some countries have shifted to ACTs for
                treating <i>P. vivax</i> malaria.
            </Typography>
        </div>
    );
};
