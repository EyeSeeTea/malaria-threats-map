import React from "react";
import { Card, Checkbox, createStyles, FormControlLabel, Link, makeStyles, Theme, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { WelcomeInfo } from "./index";
import { connect } from "react-redux";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: "24px",
        },
    })
);

const mapDispatchToProps = {};
type OwnProps = {
    welcomeInfo: Partial<WelcomeInfo>;
    onChange: (key: keyof WelcomeInfo, value: any) => void;
};
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & OwnProps;

const Welcome = ({ onChange, welcomeInfo }: Props) => {
    const { t } = useTranslation("common");
    const classes = useStyles({});
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange("agreement", event.target.checked);
    };
    return (
        <Card className={classes.paper}>
            <Typography variant={"body1"} style={{ fontWeight: "bold" }}>
                {t("data_download.step0.p1")}
            </Typography>
            <br />
            <Typography variant={"body2"}>{t("data_download.step0.p2")}</Typography>
            <br />
            <Typography variant={"body2"}>{t("data_download.step0.p3")}</Typography>
            <br />
            <Typography variant={"body2"}>
                {t("data_download.step0.p4a")}
                <Link href={t("data_download.step0.p4bLink")} target={"_blank"}>
                    {t("data_download.step0.p4bLinkText")}
                </Link>
                {t("data_download.step0.p4c")}
            </Typography>
            <br />
            <Typography variant={"body2"}>{t("data_download.step0.p5")}</Typography>
            <br />
            <Typography variant={"body2"}>{t("data_download.step0.p6")}</Typography>
            <br />
            <Typography variant={"body2"}>
                {t("data_download.step0.p7a")}
                <Link href={`mailto:${t("data_download.step0.p7bEmail")}`}>{t("data_download.step0.p7bEmail")}</Link>
            </Typography>
            <br />
            <FormControlLabel
                control={
                    <Checkbox name="checkedA" checked={welcomeInfo.agreement} onChange={handleChange} color="primary" />
                }
                label={
                    <Typography variant={"body2"}>
                        {t("data_download.step0.p8a")}
                        <Link href={t("data_download.step0.p8bLink")} target={"_blank"}>
                            {t("data_download.step0.p8bLinkText")}
                        </Link>
                    </Typography>
                }
            />
        </Card>
    );
};

export default connect(null, mapDispatchToProps)(Welcome);
