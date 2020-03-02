import { TweetState } from './TweetState';
import { TweetPostAction, TweetDeleteAction, TweetEditAction, TweetRefreshAction } from "../../../../Utils/Redux/Actions";
import { store } from "../../../../Utils/Redux/ConfigureStore";
import { changePage } from "../../../../Utils/Redux/SystemActions";
import { Page } from "../../../../Utils/Redux/SystemState";
import { TweetAPI } from "../../../../Utils/Network/TweetAPI";

export const startTweetRefresh = () : TweetRefreshAction => {
    let tweetApiController = new TweetAPI();
    let tweets = store.getState().Tweet;
    tweetApiController.refresh()
    .then((res) => {
        let body = res.body
        tweets = body;
        store.dispatch(endTweetRefresh(tweets));
    })
    .catch((err) => {
        console.log(err);
        store.dispatch(endTweetRefresh(tweets));
    });
    return {
        type: "TWEET_REFRESH",
        tweet: tweets
    } as TweetRefreshAction;
}

export const endTweetRefresh = (tweets: TweetState[]) : TweetRefreshAction => {
    store.dispatch(changePage(Page.HOME))
    return {
        type: "TWEET_REFRESH",
        tweet: tweets
    } as TweetRefreshAction
}

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
