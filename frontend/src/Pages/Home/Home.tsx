import React from "react";
import Feed from "../Components/Tweet/Feed";
import { store } from "../../Utils/Redux/ConfigureStore";
import { startTweetRefresh } from "../Components/Tweet/Redux/TweetActions";
import { PostTweet } from "../Components/Tweet/PostTweet";
import Pagination from 'react-bootstrap/Pagination';
interface IProps {

}

interface IState {
    myusername?: string
    page: number
}


export default class Home extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            myusername: store.getState().System.myusername,
            page: 0
        }
        store.dispatch(startTweetRefresh());
        store.subscribe(() => {
            let myusername = store.getState().System.myusername
            if(myusername != this.state.myusername) {
                this.setState({
                    myusername: myusername
                })
            }
        })
    }

    onNextPageClick = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            store.dispatch(startTweetRefresh(null, this.state.page))
        })
    }

    onPrevPageClick = () => {
        this.setState({
            page: Math.max(0, this.state.page - 1)
        }, () => {
            store.dispatch(startTweetRefresh(null, this.state.page))
        })
    }

    render() {
        return (
            <div style={{width:'100%'}}>
                {this.state.myusername}
                <PostTweet />
                <Feed />
                <Pagination style={{width:'100%', alignSelf:'center'}}>
                    <Pagination.Prev onClick={this.onPrevPageClick}/>
                        <Pagination.Item active>{this.state.page + 1}</Pagination.Item>
                    <Pagination.Next onClick={this.onNextPageClick}/>
                </Pagination>
            </div>
        )
    }
}