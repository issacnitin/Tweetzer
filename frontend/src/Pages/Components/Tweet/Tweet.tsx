import React from "react";
import { store } from "../../../Utils/Redux/ConfigureStore";
import { changeToProfile } from "../../../Utils/Redux/SystemActions";
import { Page } from "../../../Utils/Redux/SystemState";


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
        store.dispatch(changeToProfile(profileId));
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