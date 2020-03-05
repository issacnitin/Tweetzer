import { SystemState, Page } from "./SystemState";
import { SystemActionTypes } from "./SystemActions";

const systemReducerDefaultState: SystemState = {
    page: 0
} as SystemState;

const systemReducer = (state = systemReducerDefaultState, action: SystemActionTypes) => {
    switch(action.type) {
        case "CHANGE_PAGE":
            state.page = action.page;
            return state;
        case "START_LOAD_PROFILE":
            let s = Object.assign({}, state)
            s.profile = action.profile;
            return s
        case "END_LOAD_PROFILE":
            let s2 = Object.assign({}, state)
            s2.profile = action.profile;
            return s2
        case "SET_MY_PROFILE_ID":
            let s3 = Object.assign({}, state)
            s3.myusername = action.username
            return s3
        case "START_SEARCH_PROFILE":
            let s4 = Object.assign({}, state)
            s4.searchProfiles = []
            return s4;
        case "END_SEARCH_PROFILE":
            let s5 = Object.assign({}, state)
            s5.searchProfiles = action.profiles;
            return s5
        default:
            return state;
    }
}

export {systemReducer}

