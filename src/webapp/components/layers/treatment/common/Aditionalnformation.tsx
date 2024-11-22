import * as React from "react";
import { Link, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { AditionalInformation } from "../../../../store/SelectionData";

const Margin = styled.div`
    margin-bottom: 10px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0px;
    padding: 0px;
`;

const StyledLink = styled(Link)`
    cursor: pointer;
    &:hover {
        text-decoration: none;
    }
`;

type OwnProps = {
    info: AditionalInformation[];
};

type Props = OwnProps;

const AditionalInformationContent: React.FC<Props> = ({ info }) => {
    const { t } = useTranslation();

    const [expanded, setExpanded] = React.useState(true);

    const handleExpand = React.useCallback(() => {
        setExpanded(!expanded);
    }, [expanded]);

    return (
        <Margin>
            <Row>
                <Typography variant="caption" display="block" sx={{ marginBottom: 2 }}>
                    <b>{t("common.treatment.chart.treatment_failure.aditional_information_title")}</b>
                </Typography>

                <StyledLink onClick={handleExpand} className="additional-information-link">
                    <b>
                        {expanded
                            ? t("common.treatment.chart.treatment_failure.show_less")
                            : t("common.treatment.chart.treatment_failure.show_more")}
                    </b>
                </StyledLink>
            </Row>

            {info && expanded && (
                <div>
                    {info.map(item => {
                        return (
                            <Row key={item.year}>
                                <Typography variant="caption" display="block">
                                    <b>{`${item.year}.`}&nbsp;&nbsp;</b>
                                </Typography>

                                <Typography variant="caption" display="block">
                                    <span>
                                        {item.text}
                                        {`${item.conducted.label}: `}
                                        {item.conducted.link ? (
                                            <a href={item.conducted.link}>{item.conducted.text}</a>
                                        ) : (
                                            <span>{item.conducted.text}</span>
                                        )}
                                    </span>
                                </Typography>
                            </Row>
                        );
                    })}
                </div>
            )}
        </Margin>
    );
};

export default AditionalInformationContent;
