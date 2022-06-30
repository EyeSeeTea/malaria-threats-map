import { Alert, Button, Container, Grid, Paper, Snackbar, TextField, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";
import Layout from "../layout/Layout";
import HomepageMap from "../../assets/img/homepage-map.png";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectFeedback } from "../../store/reducers/feedback-reducer";
import { feedbackFieldChange, feedbackSubmit } from "../../store/actions/feedback-actions";
import ShareDataChart from "../../assets/img/share-data-page/share-data-chart.png";
import ContributeDataGraphic from "../../assets/img/share-data-page/contribute-data.png";
import DownloadIcon from '@mui/icons-material/Download';

const ImageBanner = styled.div`
    background: linear-gradient(90deg, #bbd7e8 0%, #bbd7e800 100%), url(${HomepageMap});
    background-position: right;
    height: 50vh;
    min-height: 260px;
`;

const TitleContainer = styled(Container)`
    padding-top: 10vh;
    font-weight: lighter;
    font-size: 8vw;
`;

const RoundedPaper = styled(Paper)`
    border-radius: 10px;
    margin-top: -10vh;
    margin-bottom: 100px;
    padding: 10vmin;
`;

const SendButton = styled(Button)`
    &.MuiButton-root {
        color: white;
        font-size: 18px;
        background-color: black;
        font-weight: bold;
        width: 190px;
    }
`;

const StyledTextField = styled(TextField)`
    .MuiInputBase-root {
        background-color: #f7f7f7;
        padding-bottom: 10px;
    }
`;


const BlueStyledButton = styled(Button)`
    &.MuiButton-root {
        color: white;
        font-size: 18px;
        background-color: #1899CC;
        font-weight: bold;
        max-width: 355px;
        margin-top: 16px;
    }
`;


const BlackStyledButton = styled(Button)`
    &.MuiButton-root {
        color: white;
        font-size: 18px;
        background-color: black;
        font-weight: bold;
        max-width: 355px;
        margin-top: 16px;
    }
`;

const inputProps = {
    disableUnderline: true,
};

const mapStateToProps = (state: State) => ({
    feedback: selectFeedback(state),
});

const mapDispatchToProps = {
    fieldChange: feedbackFieldChange,
    submit: feedbackSubmit,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = StateProps & DispatchProps;

const ShareDataPage: React.FC<Props> = ({ feedback, submit, fieldChange }) => {
    const handleFieldChange = React.useCallback(
        (event: React.ChangeEvent<any>) => {
            event.persist();

            fieldChange({ prop: event.target.name, value: event.target.value });
        },
        [fieldChange]
    );

    return (
        <Layout>
            <ImageBanner>
                <TitleContainer maxWidth="xl">
                    <Typography variant="h2" component="h1" color="inherit" textTransform="uppercase">
                        Contribute to the Malaria Threats Map by sharing your <strong>data</strong>
                    </Typography>
                </TitleContainer>
            </ImageBanner>
            <Container maxWidth="xl">
                <Grid container rowSpacing={3} columnSpacing={2} sx={{ marginTop: 4 }}>
                    <Grid item md={6} xs={12}>
                    <Typography variant="h4" fontWeight="bold" color="inherit" marginBottom="25px">
                    Contribute insecticide resistance data
                    </Typography>
                    <Typography variant="body1" color="inherit" marginBottom="25px">
                    We invite data submissions from all individuals and organizations. Please report your data using the following forms and email the completed forms to us.
                    </Typography>
                    <ul>
                        <li>Discriminating concentration bioassays <a href="#">Download</a></li>
                        <li>Intensity concentration bioassays <a href="#">Download</a></li>
                        <li>Synergist insecticide bioassays <a href="#">Download</a></li>
                    </ul>
                    <BlueStyledButton variant="contained" color="primary" href="#">Send data to WHO by email</BlueStyledButton>
                    </Grid>
                            <Grid item md={6} xs={12} style={{backgroundColor: "#5CCDCE", borderRadius: "50%"}}>
                                <img src={ShareDataChart} width={726} height={471} />
                        </Grid>
                            <Grid item md={6} xs={12}>
                            <img src={ContributeDataGraphic} width={726} height={471} />
                    
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Typography variant="h4" fontWeight="bold" color="inherit" marginBottom="25px">
                                Contribute An. stephensi detection data
                                </Typography>
                                <Typography variant="body1" color="inherit" marginBottom="25px">
                                We invite data submissions from all individuals and organizations about An. stephensi detection outside of its native areas. Please report your data through the following form and send it to us.                                
                                </Typography>
                                <Grid>
                                    <Grid item md={12} xs={12}>
                                        <BlueStyledButton variant="contained" color="primary" href="#">Send data to WHO by email</BlueStyledButton>
                                    </Grid> 
                                    <Grid item md={12} xs={12}>
                                        <BlackStyledButton variant="contained" color="primary" href="#">
                                        Download the Excel template</BlackStyledButton>
                                    </Grid> 
                                </Grid>
                            </Grid>
                        </Grid>
                </Container>
        </Layout>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareDataPage);
