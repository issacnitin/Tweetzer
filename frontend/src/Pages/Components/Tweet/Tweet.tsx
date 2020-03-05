import React from "react";
import { store } from "../../../Utils/Redux/ConfigureStore";
import { startLoadProfile, changePage } from "../../../Utils/Redux/SystemActions";
import { Page } from "../../../Utils/Redux/SystemState";
import { Constants } from "../../../Utils/Constants";
import "./Tweet.css"
import { startTweetSearch } from "./Redux/TweetActions";

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

    handleOnHashtagClick = (e: React.MouseEvent) => {
        let text = e.currentTarget.innerHTML.replace('#', '%23')
        store.dispatch(startTweetSearch(text))
        store.dispatch(changePage(Page.SEARCH))
    }

    getLinkedJSX = (v: string) : any => {
        if(v.indexOf('#') == -1) {
            return v
        }
        let startindex = v.indexOf('#');
        let spaceAfterIndex = v.indexOf(' ', startindex + 1);
        if(spaceAfterIndex == -1) {
            spaceAfterIndex = v.length;
        } 
        return <div style={{display:'inline'}}>{v.substring(0, startindex)}<a href="#" onClick={(e) => this.handleOnHashtagClick(e)}>{v.substring(startindex, spaceAfterIndex)}</a>{this.getLinkedJSX(v.substring(spaceAfterIndex))}</div>
    }

    render() {
        let date = new Date(this.props.timestamp * 1000);
        
        return (
            <div style={{borderRadius: 10, background:'white', margin: 10, padding: 10}}>
                <div className="rowC">
                    <p>{date.toDateString()}&nbsp;&nbsp;</p>
                    <a href="#" onClick={(e) => this.onClickUsername(this.props.username)}>@{this.props.username}</a>
                </div>
                {
                    this.props.content.split('\n')
                    .map((v) => {
                        return <p>{this.getLinkedJSX(v)}</p>
                    })
                }
            </div>
        )
    }
}