import { AuthenticationState } from "./AuthenticationState";
import { AuthenticationActionTypes } from "../../../../Utils/Redux/Actions";

const authReducerDefaultState: AuthenticationState = {} as AuthenticationState;

const authReducer = (state = authReducerDefaultState, action: AuthenticationActionTypes) => {
    switch(action.type) {
        case "SIGN_IN":
            return action.authState;
        case "SIGN_OUT":
            return action.authState;
        default:
            return state;
    }
}

export {authReducer}

