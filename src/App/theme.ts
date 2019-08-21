import { indigo, orange, red } from "@material-ui/core/colors";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import createPalette from "@material-ui/core/styles/createPalette";

// Configure Material UI theme
const theme = responsiveFontSizes(
  createMuiTheme({
    palette: createPalette({
      primary: {
        main: "#1976D2",
      },
      secondary: {
        main: "#FFEE58",
      },
      type: "light",
    }),
    typography: {
      fontSize: 10,
      fontWeightRegular: 100,
    },
  }),
);

export default theme;
