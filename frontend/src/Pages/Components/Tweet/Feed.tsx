import React from "react";
import Tweet from './Tweet';
import { TweetState } from "./Redux/TweetState";
import { store } from "../../../Utils/Redux/ConfigureStore";

interface IProps {
    
}

interface IState {
    tweets: TweetState[],
    page: number
}

export default class Feed extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            tweets: store.getState().Tweet,
            page: 0
        }

        store.subscribe(() => {
            let tweets = store.getState().Tweet;
            tweets.sort((a, b) => b.timestamp - a.timestamp)
            this.setState({
                tweets: tweets
            });
        })
    }

    render() {
        return (
            <div style={{width:'100%'}}>
            {
                this.state.tweets.map((el, index) => (
                    <div>
                        <Tweet key={index} content={el.content} timestamp={el.timestamp} username={el.username} />
                        <br />
                    </div>
                ))
            }
            </div>
        )
    }
}