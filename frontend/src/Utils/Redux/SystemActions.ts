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

export interface SetMyProfileIdAction {
    type: typeof SET_MY_PROFILE_ID;
    profileId: string;
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
| SetMyProfileIdAction 
| StartSearchProfileAction 
| EndSearchProfileAction;

export const changePage = (page: Page): ChangePageAction => {
    return {
        type: "CHANGE_PAGE",
        page: page
    }
}

export const startLoadProfile = (profileId: string) :  StartChangeProfileAction => {
    Constants.profileId = profileId
    let identityController: IdentityAPI = new IdentityAPI();
    identityController.getProfile(profileId)
    .then((res) => {
        let profileId = res.body["profileid"];
        let profile = {} as ProfileModal;
        profile.name = res.body["name"];
        profile.username = res.body["username"];
        profile.profileId = profileId;
        Constants.profileId = profileId
        store.dispatch(endLoadProfile(profile))
        store.dispatch(startTweetRefresh(profileId))
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

export const startFetchMyDetails = () : SetMyProfileIdAction => {
    let identityController: IdentityAPI = new IdentityAPI();
    identityController.getMyProfile()
    .then((res) => {
        if(!!res && !!res.body) {
            store.dispatch(endSetMyProfileId(res.body["profileid"]))
            store.dispatch(startLoadProfile(res.body["profileid"]))
            //store.dispatch(startGetFollowers(res.body["profileid"]))
            store.dispatch(startGetFollowing(res.body["profileid"]))
        }
    })
    .catch((err) => {

    })
    return {
        type: "SET_MY_PROFILE_ID",
        profileId: ""
    }
}

export const endSetMyProfileId = (profileId: string) : SetMyProfileIdAction => {
    return {
        type: "SET_MY_PROFILE_ID",
        profileId: profileId
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
            m.profileId = profile["profileid"]
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