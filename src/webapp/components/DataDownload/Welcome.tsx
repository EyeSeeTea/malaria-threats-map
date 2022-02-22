import React from "react";
import { Card, Checkbox, FormControlLabel, Link, Theme, Typography } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { useTranslation } from "react-i18next";
import { WelcomeInfo } from "./index";
import { connect } from "react-redux";

const useStyles = makeStyles((_theme: Theme) =>
    createStyles({
        paper: {
            padding: "24px",
        },
    })
);

type OwnProps = {
    welcomeInfo: Partial<WelcomeInfo>;
    onChange: (key: keyof WelcomeInfo, value: any) => void;
};

const Welcome = ({ onChange, welcomeInfo }: OwnProps) => {
    const { t } = useTranslation();
    const classes = useStyles({});
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange("agreement", event.target.checked);
    };
    return (
        <Card className={classes.paper}>
            <Typography variant={"body1"} style={{ fontWeight: "bold" }}>
                {t("common.data_download.step0.p1")}
            </Typography>
            <br />
            <Typography variant={"body2"}>{t("common.data_download.step0.p2")}</Typography>
            <br />
            <Typography variant={"body2"}>{t("common.data_download.step0.p3")}</Typography>
            <br />
            <Typography variant={"body2"}>
                {t("common.data_download.step0.p4a")}
                <Link href={t("common.data_download.step0.p4bLink")} target={"_blank"}>
                    {t("common.data_download.step0.p4bLinkText")}
                </Link>
                {t("common.data_download.step0.p4c")}
            </Typography>
            <br />
            <Typography variant={"body2"}>{t("common.data_download.step0.p5")}</Typography>
            <br />
            <Typography variant={"body2"}>{t("common.data_download.step0.p6")}</Typography>
            <br />
            <Typography variant={"body2"}>
                {t("common.data_download.step0.p7a")}
                <Link href={`mailto:${t("common.data_download.step0.p7bEmail")}`}>
                    {t("common.data_download.step0.p7bEmail")}
                </Link>
            </Typography>
            <br />
            <FormControlLabel
                control={
                    <Checkbox name="checkedA" checked={welcomeInfo.agreement} onChange={handleChange} color="primary" />
                }
                label={
                    <Typography variant={"body2"}>
                        {t("common.data_download.step0.p8a")}
                        <Link href={t("common.data_download.step0.p8bLink")} target={"_blank"}>
                            {t("common.data_download.step0.p8bLinkText")}
                        </Link>
                    </Typography>
                }
            />
        </Card>
    );
};

export default connect(null)(Welcome);
