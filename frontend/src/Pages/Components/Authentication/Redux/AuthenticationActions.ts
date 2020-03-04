import { AuthenticationState } from "./AuthenticationState"
import { SignInAction, SignOutAction, SignUpAction } from "../../../../Utils/Redux/Actions";
import { AppState, store } from "../../../../Utils/Redux/ConfigureStore";
import { changePage, startSetMyProfileId } from "../../../../Utils/Redux/SystemActions";
import { Page } from "../../../../Utils/Redux/SystemState";
import AuthenticationAPI from "../../../../Utils/Network/AuthenticationAPI";
import { startGetFollowing } from "../../Profile/Redux/SocialActions";

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
        store.dispatch(startSetMyProfileId())
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
    store.dispatch(startGetFollowing())
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

export const startSignUp = (name: string, username: string, email: string, password: string): SignUpAction => {
    let authState: AuthenticationState = store.getState().Authentication;
    authAPIController.signUp(name, username, email, password)
    .then((res) => {
        let body = res.body
        authState.authToken = !!body ? body.token : "";
        authState.tokenRefreshTimestamp = (new Date()).getTime();
        localStorage.setItem('username', username ? username : email);
        localStorage.setItem('password', password);
        store.dispatch(endSignUp(authState))
        store.dispatch(startSetMyProfileId())
    })
    .catch((err) => {
        console.error(err)
        store.dispatch(endSignUpFail(authState, err));
    });
    return {
        type: "SIGN_UP",
        authState
    } as SignUpAction
}

export const endSignUp = (authState: AuthenticationState) : SignUpAction => {
    localStorage.setItem('token', authState.authToken);
    store.dispatch(startGetFollowing())
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
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    store.dispatch(changePage(Page.DEFAULT))
    return {
        type: "SIGN_OUT",
        authState
    } as SignOutAction
}