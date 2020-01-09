import { AuthenticationState } from "./AuthenticationState"
import { SignInAction, SignOutAction, SignUpAction } from "../../../../Utils/Redux/Actions";
import { AppState, store } from "../../../../Utils/Redux/ConfigureStore";
import { changePage } from "../../../../Utils/Redux/SystemActions";
import { Page } from "../../../../Utils/Redux/SystemState";

export const signIn = (username: string, password: string) : SignInAction => {
    let authState: AuthenticationState = store.getState().Authentication;
    authState.authToken = "token"
    authState.tokenRefreshTimestamp = 9999;
    store.dispatch(changePage(Page.DEFAULT))
    return {
        type: "SIGN_IN",
        authState
    } as SignInAction
}

export const signUp = (username: string, email: string, password: string): SignUpAction => {
    let authState: AuthenticationState = store.getState().Authentication;
    authState.authToken = "token"
    authState.tokenRefreshTimestamp = 9999;
    store.dispatch(changePage(Page.DEFAULT))
    return {
        type: "SIGN_UP",
        authState
    } as SignUpAction
}

export const signOut = (): SignOutAction => {
    let authState: AuthenticationState = store.getState().Authentication;
    authState.authToken = "token"
    authState.tokenRefreshTimestamp = -1;
    store.dispatch(changePage(Page.LOGIN))
    return {
        type: "SIGN_OUT",
        authState
    } as SignOutAction
}

