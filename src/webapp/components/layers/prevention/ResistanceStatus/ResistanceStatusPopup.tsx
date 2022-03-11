import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import Hidden from "../../../hidden/Hidden";
import PreventionPopupContent from "../PreventionPopupContent";

const ChatContainer = styled.div<{ width?: string }>`
    width: ${props => props.width || "100%"};
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: PreventionStudy[];
};
type Props = StateProps & OwnProps;

const ResistanceStatusPopup = ({ studies: baseStudies }: Props) => {
    const [study, setStudy] = useState(0);
    const speciesOptions = R.uniq(R.map(s => s.SPECIES, baseStudies));
    const suggestions: any[] = speciesOptions.map((specie: string) => ({
        label: specie,
        value: specie,
    }));
    const [species, setSpecies] = useState<any[]>(suggestions);

    const groupedStudies = R.values(
        R.groupBy(
            R.prop("CITATION_URL"),
            baseStudies.filter(
                study => !species || !species.length || species.map(s => s.value).includes(study.SPECIES)
            )
        )
    );

    const studyObject = groupedStudies[study][0];
    return (
        <>
            <Hidden smUp>
                <ChatContainer width={"100%"}>
                    <PreventionPopupContent studyObject={studyObject} />
                </ChatContainer>
            </Hidden>
            <Hidden smDown>
                <ChatContainer width={"500px"}>
                    <PreventionPopupContent studyObject={studyObject} />
                </ChatContainer>
            </Hidden>
        </>
    );
};
export default connect(mapStateToProps)(ResistanceStatusPopup);
