import { createMuiTheme } from "@material-ui/core";

export const colors = {
  prevention: {
    N: "#5abe86",
    D1: "#3a926f"
  },
  invasive: {
    N: "#5abe86",
    D1: "#3a926f"
  },
  diagnosis: {
    N: "#0099cc",
    D1: "#006080"
  },
  treatment: {
    N: "#5bcdce",
    D1: "#33a9aa"
  }
};

export const preventionTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.prevention.N
    }
  },
  overrides: {
    MuiButton: {
      label: {
        color: "white"
      }
    }
  }
});
export const diagnosisTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.diagnosis.N
    }
  },
  overrides: {
    MuiButton: {
      label: {
        color: "white"
      }
    }
  }
});
export const treatmentTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.treatment.N
    }
  },
  overrides: {
    MuiButton: {
      label: {
        color: "white"
      }
    }
  }
});
export const invasiveTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.invasive.N
    }
  },
  overrides: {
    MuiButton: {
      label: {
        color: "white"
      }
    }
  }
});

export const getTheme = (theme: string) => {
  switch (theme) {
    case "prevention":
      return preventionTheme;
    case "diagnosis":
      return diagnosisTheme;
    case "treatment":
      return treatmentTheme;
    case "invasive":
      return invasiveTheme;
    default:
      return undefined;
  }
};
