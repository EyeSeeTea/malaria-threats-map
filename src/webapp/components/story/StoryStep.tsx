import { CircularProgress } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { connect } from "react-redux";
import styled from "styled-components";
import { selectTranslations } from "../../store/reducers/translations-reducer";
import { State } from "../../store/types";

const mapStateToProps = (state: State) => ({
    translations: selectTranslations(state),
});
type StateProps = ReturnType<typeof mapStateToProps>;
interface OwnProps {
    i18nKey: string;
}

type Props = StateProps & OwnProps;

const StoryStep: React.FC<Props> = ({ translations, i18nKey }) => {
    const [loading, setLoading] = React.useState(true);

    const { t } = useTranslation();

    const markdown = React.useMemo(() => {
        const stepContent = t(i18nKey);

        if (translations.length > 0) {
            setLoading(false);
            return stepContent;
        } else {
            return null;
        }
    }, [translations, i18nKey, t]);

    return loading ? (
        <ProgressContainer>
            <CircularProgress />
        </ProgressContainer>
    ) : (
        <ReactMarkdown>{markdown}</ReactMarkdown>
    );
};

export default connect(mapStateToProps)(StoryStep);

const ProgressContainer = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
