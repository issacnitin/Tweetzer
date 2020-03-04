import React from "react";
import Feed from "../Components/Tweet/Feed";
import { store } from "../../Utils/Redux/ConfigureStore";
import { startTweetRefresh } from "../Components/Tweet/Redux/TweetActions";
import { PostTweet } from "../Components/Tweet/PostTweet";

interface IProps {

}

interface IState {
    
}


export default class Search extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }

    render() {
        return (
            <div style={{width:'100%'}}>
                <Feed />
            </div>
        )
    }
}