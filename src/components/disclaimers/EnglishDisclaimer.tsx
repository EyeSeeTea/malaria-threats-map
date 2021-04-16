import React from "react";
import { DialogContent, Link, Typography } from "@material-ui/core";

const EnglishDisclaimer = () => {
    return (
        <DialogContent
            style={{
                textAlign: "justify",
                textJustify: "inter-word",
            }}
        >
            <Typography variant={"body2"}>
                <strong>Data source:</strong> Global Malaria Programme
            </Typography>
            <Typography variant={"body2"} gutterBottom>
                <strong>Map production:</strong> Global Malaria Programme. World Health Organization.{" "}
                <Link href={"https://www.who.int/about/copyright/"} target="_blank" rel="noopener noreferrer">
                    {"© WHO 2019"}
                </Link>{" "}
                All rights reserved.
            </Typography>
            <br />
            <Typography variant={"body2"} gutterBottom>
                Unless otherwise specifically stated, the information contained in this application has been made
                available to the World Health Organization (WHO) Global Malaria Programme by Ministries of Health or
                their development partners, or through its extraction by WHO or its partners from scientific
                publications. WHO therefore provides no assurance as to the validity, accuracy or completeness of this
                information.
            </Typography>
            <Typography variant={"body2"} gutterBottom>
                The use of all images and files generated from this application is subject to the{" "}
                <Link
                    href={"https://www.who.int/about/who-we-are/publishing-policies/data-policy/terms-and-conditions"}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Terms and Conditions of use for WHO data compilations, aggregations, evaluations and analyses.
                </Link>
            </Typography>
            <br />
            <Typography variant={"body2"}>
                The following citation shall be conspicuously provided alongside images or files generated from the
                application.
            </Typography>
            <Typography variant={"caption"} gutterBottom>
                Source: WHO Malaria Threats Map (https://www.who.int/malaria/maps/threats/); date of access
            </Typography>
            <br />
            <br />
            <Typography variant={"body2"}>
                For further information, please contact:{" "}
                <Link href={"mailto:gmp-maps@who.int"} target="_blank" rel="noopener noreferrer">
                    gmp-maps@who.int
                </Link>
            </Typography>
        </DialogContent>
    );
};

export default EnglishDisclaimer;
