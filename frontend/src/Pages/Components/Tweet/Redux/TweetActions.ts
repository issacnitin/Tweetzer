import { TweetState } from './TweetState';
import { TweetPostAction, StartTweetRefreshAction, EndTweetRefreshAction, StartSearchTweetAction } from "../../../../Utils/Redux/Actions";
import { store } from "../../../../Utils/Redux/ConfigureStore";
import { TweetAPI } from "../../../../Utils/Network/TweetAPI";

export const startTweetRefresh = (username: string|null = null, page: number = 0) : StartTweetRefreshAction => {
    let tweetApiController = new TweetAPI();
    let tweets: TweetState[] = [];
    let promise: Promise<any> = tweetApiController.refresh();
    if(username != null) {
        promise = tweetApiController.fetch(username, page);
    }
    promise
    .then((res) => {
        let body = res.body
        tweets = [];
        for(let tweet of body) {
            let t : TweetState = {} as TweetState;
            t.content = tweet["content"]
            t.timestamp = tweet["timestamp"]
            t.username = tweet["username"]
            tweets.push(t)
        }
        store.dispatch(endTweetRefresh(tweets));
    })
    .catch((err) => {
        store.dispatch(endTweetRefresh(tweets));
    });
    return {
        type: "START_TWEET_REFRESH",
        tweet: tweets
    } as StartTweetRefreshAction;
}

export const startTweetSearch = (text: string, page: number = 0) : StartSearchTweetAction => {
    let tweetApiController = new TweetAPI();
    let tweets: TweetState[] = [];
    tweetApiController.search(text, page)
    .then((res) => {
        let body = res.body
        tweets = [];
        for(let tweet of body) {
            let t : TweetState = {} as TweetState;
            t.content = tweet["content"]
            t.timestamp = tweet["timestamp"]
            t.username = tweet["username"]
            tweets.push(t)
        }
        store.dispatch(endTweetRefresh(tweets));
    })
    .catch((err) => {
        store.dispatch(endTweetRefresh(tweets));
    });
    return {
        type: "START_TWEET_SEARCH",
        tweet: tweets
    } as StartSearchTweetAction; 
}

export const endTweetRefresh = (tweets: TweetState[]) : EndTweetRefreshAction => {
    return {
        type: "END_TWEET_REFRESH",
        tweet: tweets
    } as EndTweetRefreshAction
}

export const startTweetPost = (content: string, timestamp: number) : TweetPostAction => {
    
    let tweet = {} as TweetState;
    tweet.content = content;
    tweet.timestamp = timestamp;

    let tweetState = store.getState().Tweet;
    
    let tweetApiController = new TweetAPI();
    let tweets = store.getState().Tweet;
    let username = store.getState().System.myusername;
    username = !!username ? username : ""
    tweetApiController.postTweet(content)
    .then((res) => {
        if(res) {
            tweetState.unshift({content: content, timestamp: timestamp, username: username} as TweetState)
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
