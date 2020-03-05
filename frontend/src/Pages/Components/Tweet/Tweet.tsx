import React from "react";
import { store } from "../../../Utils/Redux/ConfigureStore";
import { startLoadProfile, changePage } from "../../../Utils/Redux/SystemActions";
import { Page } from "../../../Utils/Redux/SystemState";
import { Constants } from "../../../Utils/Constants";
import "./Tweet.css"

interface IProps {
    content: string
    timestamp: number
    username: string
}

interface IState {

}


export default class Tweet extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }

    onClickUsername = (username: string) => {
        Constants.username = username
        store.dispatch(changePage(Page.PROFILE));
    }

    render() {
        let date = new Date(this.props.timestamp*1000);
        return (
            <div style={{borderRadius: 10, background:'lightgrey', margin: 10, padding: 10}}>
                
                <div className="rowC">
                    <p>{date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + "   "}</p>
                    <a href="#" onClick={(e) => this.onClickUsername(this.props.username)}>@{this.props.username}</a>
                </div>
                {this.props.content}
            </div>
        )
    }
}