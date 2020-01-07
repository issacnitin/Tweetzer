import { AuthenticationState } from "../Types/AuthenticationState"
import { AppActions, SignInAction, SignOutAction } from "../Types/Actions";
import { Dispatch } from "redux";
import { AppState } from "../Store/ConfigureStore";

export const signIn = (authState: AuthenticationState) : SignInAction => ({
    type: "SIGN_IN",
    authState
} as SignInAction);

export const signOut = (authState: AuthenticationState): SignOutAction => ({
    type: "SIGN_OUT",
    authState
} as SignOutAction);

export const startSignIn = ({ username, password} : {username: string, password: string}) => {
    return (dispatch: Dispatch<SignInAction>, getState: () => AppState) => {
        dispatch(
            signIn({
                authToken: "token",
                tokenRefreshTimestamp: 999
            })
        )
    }
}

export const startSignOut = () => {
    return (dispatch: Dispatch<SignOutAction>, getState: () => AppState) => {
        dispatch(
            signOut({
                authToken: "",
                tokenRefreshTimestamp: -1
            })
        )
    }
}