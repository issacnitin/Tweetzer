import { TweetState } from "./TweetState";
import { TweetActionTypes } from "../../../../Utils/Redux/Actions";

const tweetReducerDefaultState: TweetState[] = [];

const tweetReducer = (state = tweetReducerDefaultState, action: TweetActionTypes) => {
    switch(action.type) {
        case "TWEET_POST":
            return state;
        case "TWEET_EDIT":
            return state;
        case "TWEET_DELETE":
            return state;
        case "START_TWEET_REFRESH":
            return [];
        case "START_TWEET_SEARCH":
            return [];
        case "END_TWEET_REFRESH":
            return Object.assign([], action.tweet)
        default:
            return state;
    }
}

export {tweetReducer}
