import SocialAPI from "../../../../Utils/Network/SocialAPI"
import { SocialState } from "./SocialState";
import { store } from "../../../../Utils/Redux/ConfigureStore";

export const START_FOLLOW = "START_FOLLOW";
export const END_FOLLOW = "END_FOLLOW";
export const START_UNFOLLOW = "START_UNFOLLOW";
export const END_UNFOLLOW = "END_UNFOLLOW";

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
    follower: string;
}

export interface EndUnfollowAction {
    type: typeof END_UNFOLLOW;
    follower: string;
}

export type SocialActionTypes = StartFollowAction 
| EndFollowAction 
| StartUnfollowAction 
| EndUnfollowAction;

export const startFollow = (username: string) : StartFollowAction => {
    let socialController = new SocialAPI();
    socialController.follow(username)
    .then((res) => {
        if(!!res.body) {
            store.dispatch(endFollowSuccess(username))
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

export const startUnfollow = (username: string) : StartUnfollowAction => {
    let socialController = new SocialAPI();
    socialController.unfollow(username)
    .then((res) => {
        if(!!res.body) {
            store.dispatch(endUnfollowSuccess(username))
        }
    })
    .catch((err) => {
        store.dispatch(endUnfollowFail())
    })
    return {
        type: "START_UNFOLLOW",
        follower: ""
    } as StartUnfollowAction;
}

export const endUnfollowSuccess = (following: string): EndUnfollowAction => {
    return {
        type: "END_UNFOLLOW",
        follower: following
    } as EndUnfollowAction;
}

export const endUnfollowFail = (): EndFollowAction => {
    return {
        type: "END_FOLLOW",
        following: ""
    } as EndFollowAction;
}