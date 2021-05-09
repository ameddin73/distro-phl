import {useHistory} from "react-router-dom";
import {PATHS} from "util/config";
import firebase from 'firebase/app';
import 'firebase/auth';
import {StyledFirebaseAuth} from "react-firebaseui";
import {useAuth} from "reactfire";
import theme from "../../../util/theme";

type LocationState = {
    referrer: string,
};

const Login = () => {
    const history = useHistory<LocationState>();
    const auth = useAuth();

    const {state} = history.location;
    const referrer = (state && state.referrer && state.referrer !== PATHS.public.login ? state.referrer : PATHS.public.base);

    const uiConfig = {
        signInFlow: 'popup',
        signInSuccessUrl: referrer,
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ]
    }

    return (
        <div style={{marginTop: theme.spacing(10)}}>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
        </div>
    )
};

export default Login;
