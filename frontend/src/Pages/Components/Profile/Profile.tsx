import React from "react"
import { store } from "../../../Utils/Redux/ConfigureStore"
import Feed from "../Tweet/Feed";
import { startTweetRefresh } from "../Tweet/Redux/TweetActions";
import { ProfileModal } from "../../../Utils/Redux/SystemState";

interface IProps {
    modal: ProfileModal;
}

interface IState {
    name: string;
    username: string;
}

export default class Profile extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            name: this.props.modal.name,
            username: this.props.modal.username
        }
        store.dispatch(startTweetRefresh(this.props.modal.profileId))
        store.subscribe(() => {
            let state = store.getState().System;
            console.error(!!state.profile ? state.profile.username : "")
            console.error(this.state.username)
            if(!!state.profile && (state.profile.name != this.state.name || state.profile.username != this.state.username)) {
                this.setState({
                    name: state.profile.name,
                    username: state.profile.username
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
                <Feed />
            </div>
        )
    }
}