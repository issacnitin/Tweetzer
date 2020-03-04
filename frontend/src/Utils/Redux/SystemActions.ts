import { Page, ProfileModal } from './SystemState';
import { ChangePageAction, ChangeProfileAction } from './Actions';
import { store } from './ConfigureStore';
import IdentityAPI from "../Network/IdentityAPI";
import { startTweetRefresh } from '../../Pages/Components/Tweet/Redux/TweetActions';

export const changePage = (page: Page): ChangePageAction => {
    return {
        type: "CHANGE_PAGE",
        page: page
    }
}

export const changeToProfile = (profileId: string) :  ChangeProfileAction => {
    let identityController: IdentityAPI = new IdentityAPI();
    identityController.getProfile(profileId)
    .then((res) => {
        let profileId = res.body["profileid"];
        let state = store.getState().System;
        state.profile = {} as ProfileModal;
        state.profile.name = res.body["name"];
        state.profile.username = res.body["username"];
        state.profile.profileId = profileId;
        store.dispatch(changePage(Page.PROFILE))
        store.dispatch(startTweetRefresh(profileId))
    })
    .catch((err) => {
        let state = store.getState().System;
        state.profile = undefined; 
    })
    return {
        type: "CHANGE_PROFILE",
        profileId: profileId
    }
}

export const changeToMyProfile = () :  ChangeProfileAction => {
    let identityController: IdentityAPI = new IdentityAPI();
    identityController.getMyProfile()
    .then((res) => {
        console.log(res)
        let profileId = res.body["profileid"];
        let state = store.getState().System;
        state.myid = profileId 
        state.profile = {} as ProfileModal;
        state.profile.name = res.body["name"];
        state.profile.username = res.body["username"];
        state.profile.profileId = profileId;
        store.dispatch(changePage(Page.PROFILE))
        store.dispatch(startTweetRefresh())
    })
    .catch((err) => {
        let state = store.getState().System;
        state.myid = undefined 
    })
    return {
        type: "CHANGE_PROFILE",
        profileId: ""
    }
}