import styled from "styled-components";

export const FilterWrapper = styled.div<{ onlyYMargin?: boolean }>`
    margin: ${props => (props.onlyYMargin ? "10px 0px" : "10px 20px")};
`;

export const FilterSimpleWrapper = styled.div`
    margin: 10px 0px;
`;
export const Divider = styled.div`
    height: 10px;
`;

export const FilterColumContainer = styled.div<{ padding?: string }>`
    margin: 10px 20px;
    padding: ${p => p.padding ?? "10px 20px"};
    background-color: #f5f5f5;
    border-radius: 5px;
    align-items: center;
`;

export const FilterRowContainer = styled.div<{
    margin?: string;
    padding?: string;
    background?: string;
}>`
    margin: ${props => (props.margin ? props.margin : "10px 20px")};
    padding: ${props => (props.padding ? props.padding : "10px 10px")};
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${props => props.background ?? "#f5f5f5"};
    border-radius: 5px;
`;
