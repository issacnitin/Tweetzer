import React from "react";
import Feed from "../Components/Tweet/Feed";
import { store } from "../../Utils/Redux/ConfigureStore";
import { startTweetRefresh } from "../Components/Tweet/Redux/TweetActions";
import { PostTweet } from "../Components/Tweet/PostTweet";

interface IProps {

}

interface IState {
    myid?: string
}


export default class Home extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            myid: store.getState().System.myid
        }
        store.dispatch(startTweetRefresh());
        store.subscribe(() => {
            let myid = store.getState().System.myid
            if(myid != this.state.myid) {
                this.setState({
                    myid: myid
                })
            }
        })
    }

    render() {
        return (
            <div style={{width:'100%'}}>
                {this.state.myid}
                <PostTweet />
                <Feed />
            </div>
        )
    }
}