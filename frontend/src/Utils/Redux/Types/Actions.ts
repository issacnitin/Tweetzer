import { AuthenticationState } from "./AuthenticationState";

export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";

export interface SignInAction {
    type: typeof SIGN_IN;
    authState: AuthenticationState;
}

export interface SignOutAction {
    type: typeof SIGN_OUT;
    authState: AuthenticationState;
}

export type AuthenticationActionTypes = SignInAction | SignOutAction;

export type AppActions = AuthenticationActionTypes;