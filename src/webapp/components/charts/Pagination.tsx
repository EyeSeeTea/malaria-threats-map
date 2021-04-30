import { IconButton } from "@material-ui/core";
import * as React from "react";
import ArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import styled from "styled-components";
import { sendAnalytics } from "../../utils/analytics";

type OwnProps = {
  studies: any[];
  setStudy: (study: number) => void;
  study: number;
};
type Props = OwnProps;
const FlexReverse = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

// TODO: Translations
const Pagination = ({ studies, setStudy, study }: Props) => {
  const setPage = React.useCallback((action: "next" | "prev", page: number) => {
    setStudy(page);
    sendAnalytics({ type: "event", category: "popup", action: "page", label: action });
  }, [setStudy])

  return studies.length > 1 ? (
    <FlexReverse>
      <IconButton
        aria-label="left"
        size="small"
        onClick={() => setPage("prev", study === 0 ? studies.length - 1 : study - 1)}
      >
        <ArrowLeftIcon fontSize="small" />
      </IconButton>
      {study + 1}/{studies.length}
      <IconButton
        aria-label="right"
        size="small"
        onClick={() => setPage("next", (study + 1) % studies.length)}
      >
        <ArrowRightIcon fontSize="small" />
      </IconButton>
    </FlexReverse>
  ) : (
    <></>
  );
};

export default Pagination;
