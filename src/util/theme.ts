import {createTheme, Theme} from '@material-ui/core/styles'
import {amber, blueGrey, red} from "@material-ui/core/colors";
import '../App.css';

export interface CustomTheme extends Theme {
    link: {
        '&:hover': {
            cursor: string,
        },
    }
}

function createMyTheme(): CustomTheme {
    const baseTheme = createTheme({
        palette: {
            type: "dark",
            primary: {
                main: amber[700],
            },
            secondary: {
                main: blueGrey[300],
            },
            error: {
                main: red[700],
                light: red[200],
            },
        },
    });

    return {
        ...baseTheme,
        link: {
            '&:hover': {
                cursor: "pointer",
            },
        }
    }
}

const theme = createMyTheme();
export default theme;