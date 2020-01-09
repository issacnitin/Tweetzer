import React from "react";
import Tweet from './Tweet';
import { store } from "../../../Utils/Redux/ConfigureStore";
import { TweetState } from "./Redux/TweetState";

interface IProps {

}

interface IState {
    tweets: TweetState[]
}

export default class Feed extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
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
                this.state.tweets.map((el) => {
                    return <Tweet content={el.content} timestamp={el.timestamp} />
                })
            }
            </div>
        )
    }
}