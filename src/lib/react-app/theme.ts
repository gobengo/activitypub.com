import { indigo, orange, red } from "@material-ui/core/colors";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import createPalette from "@material-ui/core/styles/createPalette";

export const activityPubRocksBackground = "#fcf9ff"; // ghostwhite
export const activityPubRocksPink = "#f1007e"; // deeppink
export const activityPubRocksGrey = "#6d6d6d"; // dimgrey
export const activityPubRocksTeal = "#16c3eb"; // deepskyblue

// Configure Material UI theme
const theme = responsiveFontSizes(
  createMuiTheme({
    palette: createPalette({
      background: {
        default: activityPubRocksBackground,
      },
      grey: {
        "500": activityPubRocksGrey,
      },
      primary: {
        contrastText: "#ffffff", // white
        main: activityPubRocksPink,
      },
      secondary: {
        main: activityPubRocksTeal,
      },
      text: {
        primary: activityPubRocksGrey,
      },
      type: "light",
    }),
    typography: {
      fontSize: 12,
      fontWeightRegular: 100,
      h1: { fontSize: "4rem" },
    },
  }),
);

export default theme;
