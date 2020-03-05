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
                following: [...state.following, action.following] 
            } as SocialState);
        case "START_UNFOLLOW":
            return Object.assign({}, {
                    followers: state.followers,
                    following: state.following
                })
        case "END_UNFOLLOW":
            let following2 = state.following;
            let index = following2.indexOf(action.follower);
            following2 = following2.filter((v) => {
                return v != action.follower;
            })
            return Object.assign({}, {
                    followers: state.followers,
                    following: following2
                })
            
        case "START_GET_FOLLOWERS":
            return state;
        case "END_GET_FOLLOWERS":
            return Object.assign({}, state, {
                followers: action.followers,
                following: state.following
            } as SocialState);
        case "START_GET_FOLLOWING":
            return state;
        case "END_GET_FOLLOWING":
            return Object.assign({}, state, {
                followers: state.followers,
                following: action.following
            } as SocialState);
        default:
            return state;
    }
}

export {socialReducer}

