import React from "react";
import { Box, Button, Card, Checkbox, FormControlLabel, Grid, List, Stack, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { connect } from "react-redux";
import styled from "styled-components";
import { DatabaseSelection, TermsInfo } from "../types";
import { DatabaseItem } from "./DatabaseItem";

type OwnProps = {
    termsInfo: Partial<TermsInfo>;
    selectedDatabases: DatabaseSelection[];
    onChange: (key: keyof TermsInfo, value: any) => void;
    onChooseOther: () => void;
};

const Terms = ({ onChange, termsInfo, selectedDatabases, onChooseOther }: OwnProps) => {
    const { t } = useTranslation();
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange("agreement", event.target.checked);
    };

    const termsAndConditionsLink = "https://www.who.int/about/policies/publishing/data-policy/terms-and-conditions";

    return (
        <React.Fragment>
            <Grid container rowSpacing={3} columnSpacing={4}>
                <Grid item md={6} xs={12}>
                    <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 6 }}>
                        {t("common.data_download.terms_step.title")}
                    </Typography>
                    <TermsContainer>
                        <div>
                            <Typography variant={"body1"}>
                                <Trans i18nKey="common.data_download.terms_step.p1" t={t}>
                                    The use of all data is subject to the{" "}
                                    <a href={termsAndConditionsLink}>Terms and conditions</a>
                                    of use for WHO compilations, aggregations, evaluations and analyses. By using the
                                    Datasets or any presentations of data derived from them, you agree to be bound by
                                    and adhere to these Terms and Conditions, as may be amended from time to time by WHO
                                    at its sole discretion. If any datasets are credited to a source other than WHO,
                                    then those materials are not covered by these Terms and Conditions, and permission
                                    should be sought from the source.
                                </Trans>
                            </Typography>

                            <br />
                            <Typography variant={"h5"} gutterBottom>
                                {t("common.data_download.terms_step.acknowledgements")}
                            </Typography>
                            <Typography variant={"body1"}>{t("common.data_download.terms_step.p2")}</Typography>
                        </div>
                        <FormControlLabel
                            sx={{ paddingTop: 3 }}
                            control={
                                <Checkbox
                                    name="checkedA"
                                    checked={termsInfo.agreement}
                                    onChange={handleChange}
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant={"body2"}>
                                    <Trans i18nKey="common.data_download.terms_step.check" t={t}>
                                        Check here to indicated that you have read and agree to the{" "}
                                        <a href={termsAndConditionsLink}>Terms and Conditions</a>
                                        of use for WHO data compilations, aggregations, evaluations and analyses.
                                    </Trans>
                                </Typography>
                            }
                        />
                    </TermsContainer>
                </Grid>
                <Grid item md={6} xs={12}>
                    <RoundedCard elevation={0}>
                        <Typography variant="h4" fontWeight="bold">
                            {t("common.data_download.terms_step.summary_title")}
                        </Typography>

                        <StyledList>
                            {selectedDatabases.map((database, index) => {
                                return (
                                    <DatabaseItem
                                        key={database.id}
                                        database={database}
                                        addDivider={index < selectedDatabases.length - 1}
                                    />
                                );
                            })}
                        </StyledList>

                        <Box sx={{ flexGrow: 1 }} />

                        <Stack direction="row" justifyContent="end">
                            <Button
                                variant="text"
                                color="primary"
                                sx={{ textDecoration: "underline", width: "220px", textTransform: "unset" }}
                                onClick={onChooseOther}
                            >
                                {t("common.data_download.terms_step.choose_other")}
                            </Button>
                        </Stack>
                    </RoundedCard>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default connect(null)(Terms);

const TermsContainer = styled.div`
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const RoundedCard = styled(Card)`
    padding: 30px;
    border-radius: 12px;
    background: #f5f5f5;
    min-height: 300px;
    display: flex;
    flex-direction: column;
`;

const StyledList = styled(List)`
    > div {
        gap: 16px;
        flex-direction: column;

        @media (min-width: 768px) {
            flex-direction: row;
        }
    }
`;
