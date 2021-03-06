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
    typography: {
        h6: {
            fontFamily: font
        }
    }
})
export default theme;