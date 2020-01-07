import { AuthenticationState } from "../../Pages/Components/Authentication/Redux/AuthenticationState";
import { Page } from "./SystemState";

export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";
export const CHANGE_PAGE = "CHANGE_PAGE";

export interface SignInAction {
    type: typeof SIGN_IN;
    authState: AuthenticationState;
}

export interface SignOutAction {
    type: typeof SIGN_OUT;
    authState: AuthenticationState;
}

export interface ChangePageAction {
    type: typeof CHANGE_PAGE;
    page: Page
}

export type AuthenticationActionTypes = SignInAction | SignOutAction;
export type SystemActionTypes = ChangePageAction;

export type AppActions = AuthenticationActionTypes | SystemActionTypes;