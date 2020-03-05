import React from "react"
import { Button } from "react-bootstrap";
import { store } from "../../../Utils/Redux/ConfigureStore";
import { startFollow, startUnfollow } from "./Redux/SocialActions";
import SocialAPI from "../../../Utils/Network/SocialAPI";
import { Page } from "../../../Utils/Redux/SystemState";

interface IProps {
    username: string
}

interface IState {
    following: boolean
}

export default class FollowButton extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            following: false
        }

    }
    componentWillReceiveProps(nextProps: IProps) {
        if(nextProps.username != this.props.username) {
            let apiController = new SocialAPI();
            apiController.isFollowing(nextProps.username)
            .then((res) => {
                this.setState({
                    following: "result" in res.body && res.body["result"] == true
                })
            })
            .catch((err) => {
                console.error(err)
            })
        }
    }

    onFollowButtonClick = () => {
        store.dispatch(startFollow(this.props.username))
        this.setState({
            following: true
        })
    }
    
    onUnfollowButtonClick = () => {
        store.dispatch(startUnfollow(this.props.username))
        this.setState({
            following: false
        })
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