import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, Link, makeStyles } from "@material-ui/core";

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
                <b>Monitoring insecticide resistance in malaria vectors is essential</b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                <b>
                    80 of 89 malaria-endemic countries reported monitoring for insecticide resistance between 2010 and
                    2017. The extent and quality of data varies between countries.
                </b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Malaria prevention is heavily reliant on core tools that target malaria mosquitoes: long-lasting
                insecticidal nets and indoor residual insecticide sprays. Resistance of mosquitoes to insecticides is a
                major concern particularly for pyrethroids as these are the only insecticide class currently approved
                for use on nets.
            </Typography>
            <br />
            <Typography variant={"body2"}>
                The WHO Global Plan for Insecticide Resistance Management in malaria vectors (GPIRM) is a call to action
                to maintain the effectiveness of malaria vector control. Resistance monitoring is needed to inform
                resistance mitigation and management strategies.
            </Typography>
            <br />
            <Link
                href="https://www.who.int/malaria/publications/atoz/gpirm/en/"
                target="_blank"
                color={"textSecondary"}
            >
                <img
                    src="https://www.who.int/entity/malaria/publications/atoz/9789241564472_cover.jpg"
                    alt="prevention 1"
                />
            </Link>
        </div>
    );
};
