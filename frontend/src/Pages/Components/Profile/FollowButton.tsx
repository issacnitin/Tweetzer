import React from "react"
import { Button } from "react-bootstrap";
import { store } from "../../../Utils/Redux/ConfigureStore";
import { startFollow } from "./Redux/SocialActions";

interface IProps {
    profileId: string
}

interface IState {
    following: boolean
}

export default class FollowButton extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        let state = store.getState().Social
        this.state = {
            following: state.following.indexOf(this.props.profileId) > -1
        }
        store.subscribe(() => {
            let state = store.getState().Social.following
            this.setState({
                following: state.indexOf(this.props.profileId) > -1
            })
        })
    }

    onFollowButtonClick = () => {
        store.dispatch(startFollow(this.props.profileId))
    }
    
    onUnfollowButtonClick = () => {
        // store.dispatch(startUnfollow(this.props.profileId))
    }

    render() {
        return (
            <div>
                {
                    this.state.following ? 
                    <Button onClick={this.onUnfollowButtonClick}>Unfollow</Button>
                    :
                    <Button onClick={this.onFollowButtonClick}>Follow</Button>
                }
            </div>
        )
    }
}