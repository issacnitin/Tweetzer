import { SocialState } from "./SocialState";
import { SocialActionTypes } from "../../Profile/Redux/SocialActions";

const socialReducerDefaultState: SocialState = {
    following: [],
    followers: []
} as SocialState;

const socialReducer = (state = socialReducerDefaultState, action: SocialActionTypes) => {
    switch(action.type) {
        case "START_FOLLOW":
            return state;
        case "END_FOLLOW":
            return Object.assign(state.following, ...state.following, action.following);
        case "START_GET_FOLLOWERS":
            return state;
        case "END_GET_FOLLOWERS":
            return Object.assign(state.followers, [], action.followers);
        case "START_GET_FOLLOWING":
            return state;
        case "START_GET_FOLLOWING":
            return Object.assign(state.following, [], action.following);
        default:
            return state;
    }
}

export {socialReducer}

