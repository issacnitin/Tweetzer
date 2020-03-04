import React from "react";
import Feed from "../Components/Tweet/Feed";
import { store } from "../../Utils/Redux/ConfigureStore";
import SearchUserComponent from "./SearchUserComponent";
import { ProfileModal } from "../../Utils/Redux/SystemState";

interface IProps {

}

interface IState {
    profiles?: ProfileModal[]
}


export default class Search extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        let state = store.getState().System.searchProfiles;
        this.state = {
            profiles: state
        }
        store.subscribe(() => {
            let profiles = store.getState().System.searchProfiles
            this.setState({
                profiles: profiles
            })
        })
    }

    render() {
        return (
            <div style={{width:'100%'}}>
                {
                    this.state.profiles?.map((el) => {
                        console.log(el)
                        return <div>
                            <SearchUserComponent name={el.name} username={el.username} profileId={el.profileId} />
                            <br />
                        </div>
                    })
                }
                <Feed />
            </div>
        )
    }
}