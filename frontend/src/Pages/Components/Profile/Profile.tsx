import React from "react"
import { store } from "../../../Utils/Redux/ConfigureStore"
import Feed from "../Tweet/Feed";
import { startTweetRefresh } from "../Tweet/Redux/TweetActions";
import { ProfileModal } from "../../../Utils/Redux/SystemState";

interface IProps {
    modal: ProfileModal;
}

interface IState {
}

export default class Profile extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        store.dispatch(startTweetRefresh(this.props.modal.profileId))
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