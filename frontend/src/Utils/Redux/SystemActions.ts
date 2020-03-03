import { Page } from './SystemState';
import { ChangePageAction, SetProfileAction } from './Actions';
import { store } from './ConfigureStore';
import IdentityAPI from "../Network/IdentityAPI";

export const changePage = (page: Page): ChangePageAction => {
    return {
        type: "CHANGE_PAGE",
        page: page
    }
}

export const setProfile = (profileId: string) :  SetProfileAction => {
    let state = store.getState().System;
    state.profileid = profileId 
    return {
        type: "SET_PROFILE",
        profileId: profileId
    }
}

export const setMyProfile = () :  SetProfileAction => {
    let identityController: IdentityAPI = new IdentityAPI();
    identityController.getMyProfile()
    .then((res) => {
        let profileId = res.body["profileid"];
        let state = store.getState().System;
        state.myid = profileId 
    })
    .catch((err) => {
        let state = store.getState().System;
        state.myid = undefined 
    })
    return {
        type: "SET_PROFILE",
        profileId: ""
    }
}