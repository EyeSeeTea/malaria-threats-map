import styled from "styled-components";
import HomepageMap from "../../assets/img/homepage-map.png";

const ImageBanner = styled.div<{ height?: string; minHeight?: string; bgColor1?: string; bgColor2?: string }>`
    background: ${props =>
        `linear-gradient(90deg, ${props.bgColor1 ?? "#bbd7e8"} 0%, ${
            props.bgColor2 ?? "#bbd7e800"
        } 100%), url(${HomepageMap});`};
    background-position: right;
    height: ${props => `${props.height ?? "40vh"}`};
    min-height: ${props => `${props.minHeight ?? "260px"}`};
`;

export default ImageBanner;
