import React from "react";
import Feed from "../Components/Tweet/Feed";
import { store } from "../../Utils/Redux/ConfigureStore";
import SearchUserComponent from "./SearchUserComponent";
import { ProfileModal } from "../../Utils/Redux/SystemState";
import Pagination from 'react-bootstrap/Pagination';
import { startTweetRefresh } from "../Components/Tweet/Redux/TweetActions";
import { startSearchProfile } from "../../Utils/Redux/SystemActions";
import { Constants } from "../../Utils/Constants";

interface IProps {

}

interface IState {
    searchstring: string,
    profiles?: ProfileModal[],
    page: number
}


export default class Search extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        let state = store.getState().System.searchProfiles;
        this.state = {
            searchstring: !!Constants.searchstring ? Constants.searchstring : "",
            profiles: state,
            page: 0
        }
        store.subscribe(() => {
            let profiles = store.getState().System.searchProfiles
            this.setState({
                profiles: profiles
            })
        })
    }

    onNextPageClick = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            store.dispatch(startSearchProfile(this.state.searchstring, this.state.page))
            store.dispatch(startTweetRefresh(null, this.state.page))
        })
    }

    onPrevPageClick = () => {
        this.setState({
            page: Math.max(0, this.state.page - 1)
        }, () => {
            store.dispatch(startSearchProfile(this.state.searchstring, this.state.page))
            store.dispatch(startTweetRefresh(null, this.state.page))
        })
    }

    render() {
        return (
            <div style={{width:'100%'}}>
                {
                    this.state.profiles?.map((el) => {
                        return <div>
                            <SearchUserComponent name={el.name} username={el.username} />
                            <br />
                        </div>
                    })
                }
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