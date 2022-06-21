import { Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";
import Layout from "../layout/Layout";
import HomepageMap from "../../assets/img/homepage-map.png";

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

const inputProps = {
    disableUnderline: true,
};

export const ContactPage: React.FC = () => {
    return (
        <Layout>
            <ImageBanner>
                <TitleContainer maxWidth="xl">
                    <Typography variant="h2" component="h1" color="inherit" textTransform="uppercase">
                        Contribute to the Malaria Threats Map by sharing your <strong>feedback</strong>
                    </Typography>
                </TitleContainer>
            </ImageBanner>
            <Container maxWidth="xl">
                <RoundedPaper>
                    <Typography variant="h4" component="h2" color="inherit" textAlign="center">
                        <strong>Send us your feedback</strong>
                    </Typography>
                    <form>
                        <Grid container rowSpacing={3} columnSpacing={2} sx={{ marginTop: 4 }}>
                            <Grid item md={6} xs={12}>
                                <StyledTextField
                                    fullWidth={true}
                                    variant="filled"
                                    name="name"
                                    placeholder="Your name"
                                    InputProps={inputProps}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <StyledTextField
                                    fullWidth={true}
                                    variant="filled"
                                    name="email"
                                    placeholder="Your email address"
                                    InputProps={inputProps}
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <StyledTextField
                                    fullWidth={true}
                                    variant="filled"
                                    name="subject"
                                    placeholder="Subject"
                                    InputProps={inputProps}
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <StyledTextField
                                    fullWidth={true}
                                    multiline
                                    variant="filled"
                                    name="message"
                                    placeholder="Message"
                                    rows={6}
                                    InputProps={inputProps}
                                />
                            </Grid>

                            <Grid item xs={2}>
                                <SendButton>{"Send"}</SendButton>
                            </Grid>
                        </Grid>
                    </form>
                </RoundedPaper>
            </Container>
        </Layout>
    );
};
