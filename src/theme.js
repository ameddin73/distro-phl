import {createMuiTheme} from '@material-ui/core/styles'
import {orange} from "@material-ui/core/colors";
import './App.css';

const font =  "'Wallpoet', sans-serif";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: orange[500]
        },
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