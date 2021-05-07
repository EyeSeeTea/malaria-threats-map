import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        margin: "10px 24px",
        border: "1px solid black",
    },
    note: {
        padding: 10,
    },
});

const Pfhrp23Note = () => {
    const { t } = useTranslation("common");
    const classes = useStyles({});
    
return (
    <div className={classes.root}>
        <div className={classes.note}>
            <Trans i18nKey="filters.pfhrp23_note" t={t}>
            Across surveys, the criteria for selecting samples to test for<i>pfhrp 2/3</i>deletions varies; therefore, refer to the full report cited for more details.
            </Trans>
        </div>
    </div>
);
};
export default Pfhrp23Note;
