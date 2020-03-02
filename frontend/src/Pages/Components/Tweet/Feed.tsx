import React from "react";
import Tweet from './Tweet';
import { TweetState } from "./Redux/TweetState";
import { store } from "../../../Utils/Redux/ConfigureStore";
import { startTweetRefresh } from "../Tweet/Redux/TweetActions";
interface IProps {
    
}

interface IState {
    tweets: TweetState[]
}

export default class Feed extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        
        this.state = {
            tweets: store.getState().Tweet
        }

        store.subscribe(() => {
            let tweets = store.getState().Tweet;
            this.setState({
                tweets: tweets
            });
        })
    }

    render() {
        return (
            <div>
            {
                this.state.tweets.map((el) => (
                    <div>
                        <Tweet content={el.content} timestamp={el.timestamp} />
                        <br />
                    </div>
                ))
            }
            </div>
        )
    }
}