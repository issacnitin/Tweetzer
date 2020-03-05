import { Page, ProfileModal } from './SystemState';
import { store } from './ConfigureStore';
import IdentityAPI from "../Network/IdentityAPI";
import { startTweetRefresh } from '../../Pages/Components/Tweet/Redux/TweetActions';
import { Constants } from '../Constants';
import { startGetFollowers, startGetFollowing } from '../../Pages/Components/Profile/Redux/SocialActions';

export const START_LOAD_PROFILE = "START_LOAD_PROFILE";
export const END_LOAD_PROFILE = "END_LOAD_PROFILE";
export const SET_MY_PROFILE_ID = "SET_MY_PROFILE_ID";
export const CHANGE_PAGE = "CHANGE_PAGE";
export const START_SEARCH_PROFILE = "START_SEARCH_PROFILE";
export const END_SEARCH_PROFILE = "END_SEARCH_PROFILE";

export interface ChangePageAction {
    type: typeof CHANGE_PAGE;
    page: Page
}

export interface StartChangeProfileAction {
    type: typeof START_LOAD_PROFILE;
    profile: ProfileModal
}

export interface EndChangeProfileAction {
    type: typeof END_LOAD_PROFILE;
    profile: ProfileModal
}

export interface SetMyUsernameAction {
    type: typeof SET_MY_PROFILE_ID;
    username: string;
}

export interface StartSearchProfileAction {
    type: typeof START_SEARCH_PROFILE
}

export interface EndSearchProfileAction {
    type: typeof END_SEARCH_PROFILE,
    profiles: ProfileModal[]
}

export type SystemActionTypes = ChangePageAction 
| StartChangeProfileAction 
| EndChangeProfileAction 
| SetMyUsernameAction 
| StartSearchProfileAction 
| EndSearchProfileAction;

export const changePage = (page: Page): ChangePageAction => {
    return {
        type: "CHANGE_PAGE",
        page: page
    }
}

export const startLoadProfile = (username: string) :  StartChangeProfileAction => {
    Constants.username = username
    let identityController: IdentityAPI = new IdentityAPI();
    identityController.getProfile(username)
    .then((res) => {
        let profile = {} as ProfileModal;
        profile.name = res.body["name"];
        profile.username = res.body["username"];
        Constants.username = username
        store.dispatch(endLoadProfile(profile))
    })
    .catch((err) => {
        let state = store.getState().System;
        state.profile = undefined; 
    })
    return {
        type: "START_LOAD_PROFILE",
        profile: {} as ProfileModal
    }
}

export const endLoadProfile = (profile: ProfileModal) : EndChangeProfileAction => {
    return {
        type: "END_LOAD_PROFILE",
        profile: profile
    }
}

export const startFetchMyDetails = () : SetMyUsernameAction => {
    let identityController: IdentityAPI = new IdentityAPI();
    identityController.getMyProfile()
    .then((res) => {
        if(!!res && !!res.body) {
            store.dispatch(endSetMyUsername(res.body["username"]))
            store.dispatch(startLoadProfile(res.body["username"]))
            //store.dispatch(startGetFollowers(res.body["username"]))
            store.dispatch(startGetFollowing(res.body["username"]))
        }
    })
    .catch((err) => {

    })
    return {
        type: "SET_MY_PROFILE_ID",
        username: ""
    }
}

export const endSetMyUsername = (username: string) : SetMyUsernameAction => {
    return {
        type: "SET_MY_PROFILE_ID",
        username: username
    }
}

export const startSearchProfile = (text: string) : StartSearchProfileAction => {
    let identityController = new IdentityAPI();
    identityController.searchUser(text)
    .then((res) => {
        let body = res.body;
        let modals: ProfileModal[] = [];
        for(let profile of body) {
            let m : ProfileModal = {} as ProfileModal;
            m.name = profile["name"]
            m.username = profile["username"]
            modals.push(m)
        }
        store.dispatch(endSearchProfile(modals))
    })
    .catch((err) => {

    })
    return {
        type: "START_SEARCH_PROFILE"
    }
}

export const endSearchProfile = (profileModals: ProfileModal[]) : EndSearchProfileAction => {
    return {
        type: "END_SEARCH_PROFILE",
        profiles: profileModals
    }
}