import React from "react";
import { store } from "../../../Utils/Redux/ConfigureStore";
import { startLoadProfile, changePage } from "../../../Utils/Redux/SystemActions";
import { Page } from "../../../Utils/Redux/SystemState";
import { Constants } from "../../../Utils/Constants";


interface IProps {
    content: string
    timestamp: number
    profileId: string
}

interface IState {

}


export default class Tweet extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }

    onClickProfileId = (profileId: string) => {
        Constants.profileId = profileId
        store.dispatch(changePage(Page.PROFILE));
    }

    render() {
        return (
            <div style={{borderRadius: 10, background:'lightgrey', margin: 10}}>
                {this.props.content}
                <br />
                {this.props.timestamp}
                <br />
                <a href="#" onClick={(e) => this.onClickProfileId(this.props.profileId)}>{this.props.profileId}</a>
            </div>
        )
    }
}