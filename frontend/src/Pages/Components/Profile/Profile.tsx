import React from "react"
import { store } from "../../../Utils/Redux/ConfigureStore"
import Feed from "../Tweet/Feed";
import { startTweetRefresh } from "../Tweet/Redux/TweetActions";
import { ProfileModal } from "../../../Utils/Redux/SystemState";
import FollowButton from "./FollowButton";

interface IProps {
    modal: ProfileModal;
}

interface IState {
    name: string;
    username: string;
    mine: boolean;
}

export default class Profile extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            name: this.props.modal.name,
            username: this.props.modal.username,
            mine: false
        }

        store.dispatch(startTweetRefresh(this.props.modal.profileId))
        store.subscribe(() => {
            let state = store.getState().System;
            if(!!state.profile && (state.profile.name != this.state.name || state.profile.username != this.state.username)) {
                this.setState({
                    name: state.profile.name,
                    username: state.profile.username,
                    mine: state.profile.profileId == state.myid
                })
            }
        })
    }

    render() {
        return (
            <div>
                <div>
                    NAME: {this.props.modal.name}
                    USERNAME: {this.props.modal.username}
                </div>
                {
                    !this.state.mine ? 
                    <FollowButton profileId={this.props.modal.profileId}/>
                    :
                    <div />
                }
                <Feed />
            </div>
        )
    }
}