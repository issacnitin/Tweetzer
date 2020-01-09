import { TweetState } from './TweetState';
import { TweetPostAction, TweetDeleteAction, TweetEditAction } from "../../../../Utils/Redux/Actions";
import { store } from "../../../../Utils/Redux/ConfigureStore";
import { changePage } from "../../../../Utils/Redux/SystemActions";
import { Page } from "../../../../Utils/Redux/SystemState";

export const tweetPost = (content: string, timestamp: number) => {
    let tweet = {} as TweetState;
    tweet.content = content;
    tweet.timestamp = timestamp;

    let tweetState = store.getState().Tweet;

    return {
        type: "TWEET_POST",
        tweetState
    }
}

export const tweetEdit = (content: string, timestamp: number) => {
    let tweet = {} as TweetState;
    tweet.content = content;
    tweet.timestamp = timestamp;

    let tweetState = store.getState().Tweet;

    return {
        type: "TWEET_EDIT",
        tweetState
    }
}

export const tweetDelete = (content: string, timestamp: number) => {
    let tweet = {} as TweetState;
    tweet.content = content;
    tweet.timestamp = timestamp;

    let tweetState = store.getState().Tweet;

    return {
        type: "TWEET_DELETE",
        tweetState
    }
}
