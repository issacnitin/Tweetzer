import { SocialState } from "./SocialState";
import { SocialActionTypes } from "../../Profile/Redux/SocialActions";

const socialReducerDefaultState: SocialState = {
    following: [],
    followers: []
} as SocialState;

const socialReducer = (state = socialReducerDefaultState, action: SocialActionTypes) : SocialState => {
    switch(action.type) {
        case "START_FOLLOW":
            let following = state.following;
            following.push(action.following)
            return Object.assign({}, {
                followers: state.followers,
                following: following
            } as SocialState);
        case "END_FOLLOW":
            return Object.assign({}, {
                followers: state.followers,
                following: state.following // TODO: Bug
            } as SocialState);
        case "START_GET_FOLLOWERS":
            return state;
        case "END_GET_FOLLOWERS":
            return Object.assign({}, state, {
                followers: action.followers,
                following: state.following
            } as SocialState);
        case "START_GET_FOLLOWING":
            return state;
        case "START_GET_FOLLOWING":
            return Object.assign({}, state, {
                followers: state.followers,
                following: action.following
            } as SocialState);
        default:
            return state;
    }
}

export {socialReducer}

