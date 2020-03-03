import { AuthenticationState } from "./AuthenticationState"
import { SignInAction, SignOutAction, SignUpAction } from "../../../../Utils/Redux/Actions";
import { AppState, store } from "../../../../Utils/Redux/ConfigureStore";
import { changePage } from "../../../../Utils/Redux/SystemActions";
import { Page } from "../../../../Utils/Redux/SystemState";
import AuthenticationAPI from "../../../../Utils/Network/AuthenticationAPI";

let authAPIController = new AuthenticationAPI();

export const startSignIn = (username: string, password: string) : SignInAction => {
    let authState: AuthenticationState = store.getState().Authentication;
    authAPIController.signIn(username, password)
    .then((res) => {
        let body = res.body
        authState.authToken = !!body ? body["Token"] : "";
        authState.tokenRefreshTimestamp = (new Date()).getTime();
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        store.dispatch(endSignIn(authState))
    })
    .catch((err) => {
        store.dispatch(endSignInWithFail(authState));
    })
    return {
        type: "SIGN_IN",
        authState
    } as SignInAction
}

export const endSignIn = (authState: AuthenticationState) : SignInAction => {
    store.dispatch(changePage(Page.HOME))
    return {
        type: "SIGN_IN",
        authState
    } as SignInAction
}

export const endSignInWithFail = (authState: AuthenticationState): SignInAction => {
    return {
        type: "SIGN_IN",
        authState
    } as SignInAction
}

export const startSignUp = (username: string, email: string, password: string): SignUpAction => {
    let authState: AuthenticationState = store.getState().Authentication;
    authAPIController.signUp(username, email, password)
    .then((res) => {
        let body = res.body
        authState.authToken = !!body ? body.token : "";
        authState.tokenRefreshTimestamp = (new Date()).getTime();
        localStorage.setItem('username', username ? username : email);
        localStorage.setItem('password', password);
        store.dispatch(endSignUp(authState))
    })
    .catch((err) => {
        console.log(err)
        store.dispatch(endSignUpFail(authState, err));
    });
    return {
        type: "SIGN_UP",
        authState
    } as SignUpAction
}

export const endSignUp = (authState: AuthenticationState) : SignUpAction => {
    localStorage.setItem('token', authState.authToken);
    store.dispatch(changePage(Page.HOME))
    return {
        type: "SIGN_UP",
        authState
    } as SignUpAction
}

export const endSignUpFail = (authState: AuthenticationState, error: string) : SignUpAction => {
    return {
        type: "SIGN_UP",
        authState
    } as SignUpAction
}

export const signOut = (): SignOutAction => {
    let authState: AuthenticationState = store.getState().Authentication;
    authState.authToken = ""
    authState.tokenRefreshTimestamp = -1;
    store.dispatch(changePage(Page.DEFAULT))
    return {
        type: "SIGN_OUT",
        authState
    } as SignOutAction
}