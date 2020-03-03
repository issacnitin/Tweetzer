import { TweetState } from './TweetState';
import { TweetPostAction, TweetDeleteAction, TweetEditAction, TweetRefreshAction } from "../../../../Utils/Redux/Actions";
import { store } from "../../../../Utils/Redux/ConfigureStore";
import { changePage } from "../../../../Utils/Redux/SystemActions";
import { Page } from "../../../../Utils/Redux/SystemState";
import { TweetAPI } from "../../../../Utils/Network/TweetAPI";

export const startTweetRefresh = (profileId: string|null = null) : TweetRefreshAction => {
    let tweetApiController = new TweetAPI();
    let tweets: TweetState[] = [];
    store.getState().Tweet = [];
    tweetApiController.refresh()
    .then((res) => {
        let body = res.body
        tweets = [];
        for(let tweet of body) {
            let t : TweetState = {} as TweetState;
            t.content = tweet["content"]
            t.timestamp = tweet["timestamp"]
            t.profileId = tweet["profileId"]
            tweets.push(t)
        }
        store.dispatch(endTweetRefresh(tweets));
    })
    .catch((err) => {
        store.dispatch(endTweetRefresh(tweets));
    });
    return {
        type: "TWEET_REFRESH",
        tweet: tweets
    } as TweetRefreshAction;
}

export const endTweetRefresh = (tweets: TweetState[]) : TweetRefreshAction => {
    store.getState().Tweet = tweets;
    return {
        type: "TWEET_REFRESH",
        tweet: tweets
    } as TweetRefreshAction
}

export const startTweetPost = (content: string, timestamp: number) : TweetPostAction => {
    
    let tweet = {} as TweetState;
    tweet.content = content;
    tweet.timestamp = timestamp;

    let tweetState = store.getState().Tweet;
    
    let tweetApiController = new TweetAPI();
    let tweets = store.getState().Tweet;
    let profileId = store.getState().System.myid;
    profileId = !!profileId ? profileId : ""
    tweetApiController.postTweet(content)
    .then((res) => {
        if(res) {
            tweetState.unshift({content: content, timestamp: timestamp, profileId: profileId} as TweetState)
        }
        store.dispatch(endTweetPost(tweets));
    })
    .catch((err) => {
        store.dispatch(endTweetPost(tweets));
    });

    return {
        type: "TWEET_POST",
        tweet: tweetState
    }
}

export const endTweetPost = (tweets: TweetState[]) : TweetPostAction => {
    return {
        type: "TWEET_POST",
        tweet: tweets
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
