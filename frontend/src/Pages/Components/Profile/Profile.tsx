import React from "react"
import { store } from "../../../Utils/Redux/ConfigureStore"
import Feed from "../Tweet/Feed";
import { startTweetRefresh } from "../Tweet/Redux/TweetActions";
import { ProfileModal } from "../../../Utils/Redux/SystemState";
import FollowButton from "./FollowButton";
import { startLoadProfile } from "../../../Utils/Redux/SystemActions";

interface IProps {
    
}

interface IState {
    profileId: string;
    name: string;
    username: string;
    mine: boolean;
}

export default class Profile extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        let profileId = store.getState().System.profileIdLoaded
        this.state = {
            profileId: "",
            name: "",
            username: "",
            mine: false
        }
        if(!!profileId) {
            store.dispatch(startLoadProfile(profileId))
        }
        store.dispatch(startTweetRefresh(profileId))
        store.subscribe(() => {
            let state = store.getState().System;
            if(!!state.profile) {
                this.setState({
                    name: state.profile.name,
                    username: state.profile.username,
                    mine: state.profile.profileId == state.myid,
                    profileId: state.profile.profileId
                })
            }
        })
    }

    render() {
        return (
            <div>
                <div>
                    NAME: {this.state.name}
                    USERNAME: {this.state.username}
                </div>
                {
                    !this.state.mine ? 
                    <FollowButton profileId={this.state.profileId}/>
                    :
                    <div />
                }
                <Feed />
            </div>
        )
    }
}