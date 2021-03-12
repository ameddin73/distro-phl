import {createMuiTheme} from '@material-ui/core/styles'
import {orange, red} from "@material-ui/core/colors";
import './App.css';

const font =  "'Wallpoet', sans-serif";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: orange[500]
        },
        error: {
            main: red[700],
            secondary: red[200],
        }
    },
    title: {
        fontFamily: font
    },
    link: {
        '&:hover': {
            cursor: "pointer",
        },
    },
})
export default theme;