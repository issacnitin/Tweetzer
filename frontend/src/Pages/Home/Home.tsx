import React from "react";
import Feed from "../Components/Tweet/Feed";
import { store } from "../../Utils/Redux/ConfigureStore";
import { startTweetRefresh } from "../Components/Tweet/Redux/TweetActions";

interface IProps {

}

interface IState {

}


export default class Home extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        store.dispatch(startTweetRefresh());
    }

    render() {
        return (
            <div>
                <Feed />
            </div>
        )
    }
}