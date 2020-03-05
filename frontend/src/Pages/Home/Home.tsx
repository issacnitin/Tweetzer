import React from "react";
import Feed from "../Components/Tweet/Feed";
import { store } from "../../Utils/Redux/ConfigureStore";
import { startTweetRefresh } from "../Components/Tweet/Redux/TweetActions";
import { PostTweet } from "../Components/Tweet/PostTweet";

interface IProps {

}

interface IState {
    myusername?: string
}


export default class Home extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            myusername: store.getState().System.myusername
        }
        store.dispatch(startTweetRefresh());
        store.subscribe(() => {
            let myusername = store.getState().System.myusername
            if(myusername != this.state.myusername) {
                this.setState({
                    myusername: myusername
                })
            }
        })
    }

    render() {
        return (
            <div style={{width:'100%'}}>
                {this.state.myusername}
                <PostTweet />
                <Feed />
            </div>
        )
    }
}