import React from "react"
import { store } from "../../../Utils/Redux/ConfigureStore"
import Feed from "../Tweet/Feed";
import { startTweetRefresh } from "../Tweet/Redux/TweetActions";
import { Constants } from "../../../Utils/Constants";
import FollowButton from "./FollowButton";
import { startLoadProfile } from "../../../Utils/Redux/SystemActions";
import Pagination from 'react-bootstrap/Pagination';

interface IProps {
    
}

interface IState {
    name: string;
    username: string;
    mine: boolean;
    page: number;
}

export default class Profile extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        let username = Constants.username
        this.state = {
            name: "",
            username: "",
            mine: false,
            page: 0
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

    onNextPageClick = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            store.dispatch(startTweetRefresh(this.state.username, this.state.page))
        })
    }

    onPrevPageClick = () => {
        this.setState({
            page: Math.max(0, this.state.page - 1)
        }, () => {
            store.dispatch(startTweetRefresh(this.state.username, this.state.page))
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
                <Pagination style={{width:'100%', justifyContent:'center', alignContent: 'center', display:'flex'}}>
                    <Pagination.Item onClick={this.onPrevPageClick}>Prev</Pagination.Item>
                    <Pagination.Item active>{this.state.page + 1}</Pagination.Item>
                    <Pagination.Item onClick={this.onNextPageClick}>{this.state.page + 2}</Pagination.Item>
                    <Pagination.Item onClick={this.onNextPageClick}>Next</Pagination.Item>
                </Pagination>
            </div>
        )
    }
}