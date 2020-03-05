import React from "react"
import { store } from "../../../Utils/Redux/ConfigureStore"
import Feed from "../Tweet/Feed";
import { startTweetRefresh } from "../Tweet/Redux/TweetActions";
import { Constants } from "../../../Utils/Constants";
import FollowButton from "./FollowButton";
import { startLoadProfile } from "../../../Utils/Redux/SystemActions";

interface IProps {
    
}

interface IState {
    name: string;
    username: string;
    mine: boolean;
}

export default class Profile extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        let username = Constants.username
        this.state = {
            name: "",
            username: "",
            mine: false
        }
        
        if(!!username) {
            store.dispatch(startLoadProfile(username))
        }
        store.dispatch(startTweetRefresh(username))
        store.subscribe(() => {
            let state = store.getState().System;
            if(!!state.profile) {
                this.setState({
                    name: state.profile.name,
                    username: state.profile.username,
                    mine: state.profile.username == state.myusername
                })
            }
        })
    }

    render() {
        return (
            <div>
                <div>
                    <p>{this.state.name}</p>
                    <br />
                    <p>@{this.state.username}</p>
                </div>
                {
                    !this.state.mine ? 
                    <FollowButton username={this.state.username}/>
                    :
                    <div />
                }
                <Feed />
            </div>
        )
    }
}