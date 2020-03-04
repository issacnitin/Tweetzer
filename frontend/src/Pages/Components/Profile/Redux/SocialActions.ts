import SocialAPI from "../../../../Utils/Network/SocialAPI"
import { SocialState } from "./SocialState";
import { store } from "../../../../Utils/Redux/ConfigureStore";

export const START_FOLLOW = "START_FOLLOW";
export const END_FOLLOW = "END_FOLLOW";
export const START_UNFOLLOW = "START_UNFOLLOW";
export const END_UNFOLLOW = "END_UNFOLLOW";
export const START_GET_FOLLOWERS = "START_GET_FOLLOWERS";
export const END_GET_FOLLOWERS = "END_GET_FOLLOWERS";
export const START_GET_FOLLOWING = "START_GET_FOLLOWING";
export const END_GET_FOLLOWING = "END_GET_FOLLOWING";

export interface StartFollowAction {
    type: typeof START_FOLLOW;
    following: string;
}

export interface EndFollowAction {
    type: typeof END_FOLLOW;
    following: string;
}

export interface StartUnfollowAction {
    type: typeof START_UNFOLLOW;
    following: string;
}

export interface EndUnfollowAction {
    type: typeof END_UNFOLLOW;
    following: string;
}

export interface StartGetFollowersAction {
    type: typeof START_GET_FOLLOWERS
    followers: string[]
}

export interface EndGetFollowersAction {
    type: typeof END_GET_FOLLOWERS
    followers: string[]
}

export interface StartGetFollowingAction {
    type: typeof START_GET_FOLLOWING;
    following: string[];
}

export interface EndGetFollowingAction {
    type: typeof END_GET_FOLLOWING;
    following: string[];
}

export type SocialActionTypes = StartFollowAction 
| EndFollowAction 
| StartUnfollowAction 
| EndUnfollowAction 
| StartGetFollowersAction 
| EndGetFollowersAction 
| StartGetFollowingAction 
| EndGetFollowingAction;

export const startFollow = (profileId: string) : StartFollowAction => {
    let socialController = new SocialAPI();
    socialController.follow(profileId)
    .then((res) => {
        if(!!res.body) {
            store.dispatch(endFollowSuccess(profileId))
        }
    })
    .catch((err) => {
        console.error(err)
        store.dispatch(endFollowFail())
    })
    return {
        type: "START_FOLLOW",
        following: ""
    } as StartFollowAction;
}

export const endFollowSuccess = (following: string): EndFollowAction => {
    return {
        type: "END_FOLLOW",
        following: following
    } as EndFollowAction;
}

export const endFollowFail = (): EndFollowAction => {
    return {
        type: "END_FOLLOW",
        following: ""
    } as EndFollowAction;
}

export const updateSocialState = () => {
    
}

export const startGetFollowers = () : StartGetFollowersAction => {
    let socialController = new SocialAPI();
    socialController.getFollowers()
    .then((res) => {
        store.dispatch(endGetFollowersSuccess(res.body as string[]))
    })
    .catch((err) => {
        store.dispatch(endGetFollowersFail())
    })

    return {
        type: "START_GET_FOLLOWERS",
        followers: []
    }
}

export const endGetFollowersSuccess = (followers: string[]) : EndGetFollowersAction => {
    return {
        type: "END_GET_FOLLOWERS",
        followers: followers
    }
}

export const endGetFollowersFail = () : EndGetFollowersAction => {
    return {
        type: "END_GET_FOLLOWERS",
        followers: []
    }
}