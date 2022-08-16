import React, { useMemo } from "react";
import { Card, Checkbox, FormControlLabel, Grid, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DataInfo, TermsInfo } from "./index";
import { connect } from "react-redux";
import styled from "styled-components";
import { DiagnosisIcon, InvasiveIcon, PreventionIcon, TreatmentIcon } from "../Icons";

type OwnProps = {
    termsInfo: Partial<TermsInfo>;
    dataInfo: DataInfo;
    onChange: (key: keyof TermsInfo, value: any) => void;
};

const Terms = ({ onChange, termsInfo, dataInfo }: OwnProps) => {
    const { t } = useTranslation();
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange("agreement", event.target.checked);
    };

    return (
        <React.Fragment>
            <Grid container rowSpacing={3} columnSpacing={4}>
                <Grid item md={6} xs={12}>
                    <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 6 }}>
                        {t("common.data_download.terms_step.title")}
                    </Typography>
                    <Typography variant={"body1"}>{t("common.data_download.terms_step.p1")}</Typography>
                    <br />
                    <Typography variant={"body1"}>{t("common.data_download.terms_step.p2")}</Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                    <RoundedCard elevation={0}>
                        <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 6 }}>
                            {t("common.data_download.terms_step.summary_title")}
                        </Typography>

                        <Grid container spacing={4}>
                            <Grid item xs={3}>
                                <ThemeValue dataInfo={dataInfo} />
                            </Grid>
                            <Grid item xs={9}>
                                <DataValue dataInfo={dataInfo} />
                            </Grid>
                        </Grid>
                    </RoundedCard>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        sx={{ marginTop: 8 }}
                        control={
                            <Checkbox
                                name="checkedA"
                                checked={termsInfo.agreement}
                                onChange={handleChange}
                                color="primary"
                            />
                        }
                        label={<Typography variant={"body2"}>{t("common.data_download.terms_step.check")}</Typography>}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default connect(null)(Terms);

const ThemeValue: React.FC<{ dataInfo: DataInfo }> = ({ dataInfo }) => {
    const { t } = useTranslation();

    switch (dataInfo.theme) {
        case "prevention": {
            return (
                <Stack direction="row" spacing={1}>
                    <PreventionIcon selected size={50} />
                    <Typography variant="body2" lineHeight={1.2} fontWeight="bold">
                        {t("common.themes.prevention")}
                    </Typography>
                </Stack>
            );
        }
        case "diagnosis": {
            return (
                <Stack direction="row" spacing={2}>
                    <DiagnosisIcon selected size={30} />
                    <Typography>{t("common.themes.diagnosis")}</Typography>
                </Stack>
            );
        }
        case "invasive": {
            return (
                <Stack direction="row" spacing={2}>
                    <InvasiveIcon selected size={30} />
                    <Typography>{t("common.themes.invasive")}</Typography>
                </Stack>
            );
        }
        case "treatment": {
            return (
                <Stack direction="row" spacing={2}>
                    <TreatmentIcon selected size={30} />
                    <Typography>{t("common.themes.treatment")}</Typography>
                </Stack>
            );
        }
    }
};

const DataValue: React.FC<{ dataInfo: DataInfo }> = ({ dataInfo }) => {
    const { t } = useTranslation();

    const data = useMemo(() => {
        switch (dataInfo.theme) {
            case "prevention": {
                return t(dataInfo.preventionDataset);
            }
            case "invasive": {
                return t(dataInfo.invasiveDataset);
            }
            case "diagnsosis": {
                return ""; // t(dataInfo.diagnsosisDataset);
            }
            case "treatment": {
                return t(dataInfo.treatmentDataset);
            }
        }
    }, []);

    return (
        <Stack direction="column" spacing={1}>
            <Stack direction="row" spacing={1}>
                <Typography variant="body2" fontWeight="bold" color="primary" textTransform="uppercase">
                    {t("common.data_download.terms_step.data_set")}
                </Typography>
                <Typography variant="body2">{data}</Typography>
            </Stack>
        </Stack>
    );
};

const RoundedCard = styled(Card)`
    padding: 30px;
    border-radius: 12px;
    background: #f5f5f5;
    height: 100%;
`;
