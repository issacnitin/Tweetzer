import { AuthenticationState } from "../../Pages/Components/Authentication/Redux/AuthenticationState";
import { Page } from "./SystemState";
import { TweetState } from "../../Pages/Components/Tweet/Redux/TweetState";
import { endTweetRefresh } from "../../Pages/Components/Tweet/Redux/TweetActions";

export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";
export const SIGN_UP = "SIGN_UP";
export const CHANGE_PAGE = "CHANGE_PAGE";
export const TWEET_POST = "TWEET_POST";
export const TWEET_DELETE = "TWEET_DELETE";
export const TWEET_EDIT = "TWEET_EDIT";
export const START_TWEET_REFRESH = "START_TWEET_REFRESH";
export const END_TWEET_REFRESH = "END_TWEET_REFRESH";
export const CHANGE_PROFILE = "CHANGE_PROFILE";

export interface SignInAction {
    type: typeof SIGN_IN;
    authState: AuthenticationState;
}

export interface SignOutAction {
    type: typeof SIGN_OUT;
    authState: AuthenticationState;
}

export interface SignUpAction {
    type: typeof SIGN_UP;
    authState: AuthenticationState;
}

export interface ChangePageAction {
    type: typeof CHANGE_PAGE;
    page: Page
}

export interface ChangeProfileAction {
    type: typeof CHANGE_PROFILE;
    profileId: string
}

export interface TweetPostAction {
    type: typeof TWEET_POST;
    tweet: TweetState[];
}

export interface TweetDeleteAction {
    type: typeof TWEET_DELETE;
    tweet: TweetState[];
}

export interface TweetEditAction {
    type: typeof TWEET_EDIT;
    tweet: TweetState[];
}

export interface StartTweetRefreshAction {
    type: typeof START_TWEET_REFRESH;
    tweet: TweetState[];
}

export interface EndTweetRefreshAction {
    type: typeof END_TWEET_REFRESH;
    tweet: TweetState[];
}

export type AuthenticationActionTypes = SignInAction | SignOutAction | SignUpAction;
export type SystemActionTypes = ChangePageAction | ChangeProfileAction;
export type TweetActionTypes = TweetPostAction | TweetDeleteAction | TweetEditAction | StartTweetRefreshAction | EndTweetRefreshAction;
export type AppActions = AuthenticationActionTypes | SystemActionTypes | TweetActionTypes;