import styled from "styled-components";
import HomepageMap from "../../assets/img/homepage-map.png";

const ImageBanner = styled.div<{ height?: string }>`
    background: linear-gradient(90deg, #bbd7e8 0%, #bbd7e800 100%), url(${HomepageMap});
    background-position: right;
    height: ${props => `${props.height ?? "40vh"}`};
    min-height: 260px;
`;

export default ImageBanner;
