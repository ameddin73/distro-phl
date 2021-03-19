import {createMuiTheme, Theme} from '@material-ui/core/styles'
import {orange, red} from "@material-ui/core/colors";
import './App.css';

const font = "'Wallpoet', sans-serif";

export interface CustomTheme extends Theme {
    title: {
        fontFamily: string
    }
    link: {
        '&:hover': {
            cursor: string,
        },
    }
}

function createMyTheme(): CustomTheme {
    const baseTheme = createMuiTheme({
        palette: {
            primary: {
                main: orange[500]
            },
            error: {
                main: red[700],
                light: red[200],
            },
        },
    });

    return {
        ...baseTheme,
        title: {
            fontFamily: font
        },
        link: {
            '&:hover': {
                cursor: "pointer",
            },
        }
    }
}

const theme = createMyTheme();
export default theme;