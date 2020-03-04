import { Page, ProfileModal } from './SystemState';
import { ChangePageAction, StartChangeProfileAction, EndChangeProfileAction, SetMyProfileIdAction } from './Actions';
import { store } from './ConfigureStore';
import IdentityAPI from "../Network/IdentityAPI";
import { startTweetRefresh } from '../../Pages/Components/Tweet/Redux/TweetActions';

export const changePage = (page: Page): ChangePageAction => {
    return {
        type: "CHANGE_PAGE",
        page: page
    }
}

export const startLoadProfile = (profileId: string) :  StartChangeProfileAction => {
    let identityController: IdentityAPI = new IdentityAPI();
    identityController.getProfile(profileId)
    .then((res) => {
        let profileId = res.body["profileid"];
        let profile = {} as ProfileModal;
        profile.name = res.body["name"];
        profile.username = res.body["username"];
        profile.profileId = profileId;
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

export const startSetMyProfileId = () : SetMyProfileIdAction => {
    let identityController: IdentityAPI = new IdentityAPI();
    identityController.getMyProfile()
    .then((res) => {
        if(!!res && !!res.body) {
            store.dispatch(endSetMyProfileId(res.body["profileid"]))
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