import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Link } from "@material-ui/core";

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
                <b>Prequalified Pyrethroid-PBO nets</b>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                The WHO prequalification process assesses vector control products for their safety, quality and
                entomological efficacy against published evaluation standards. Currently prequalified new types of ITNs
                have demonstrated that they are safe and effective for their intended use.
            </Typography>
            <br />
            <Typography variant={"body2"} className={classes.title}>
                The list of WHO prequalified pyrethroid-PBO nets can be consulted in the official site:{" "}
                <Link href={"https://www.who.int/pq-vector-control/prequalified-lists/en/"} target={"_blank"}>
                    https://www.who.int/pq-vector-control/prequalified-lists/en/
                </Link>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                Questions remain on long-term durability of the synergist piperonyl butoxide (PBO) on net fabric.
            </Typography>
            <br />
            <Typography variant={"body2"} className={classes.title}>
                For more information about Pyrethroid-PBO nets and their difference with pyrethroid-only nets please
                consult:{" "}
                <Link
                    href={"https://www.who.int/news-room/q-a-detail/new-types-of-insecticide-treated-nets"}
                    target={"_blank"}
                >
                    https://www.who.int/news-room/q-a-detail/new-types-of-insecticide-treated-nets
                </Link>
            </Typography>
        </div>
    );
};
