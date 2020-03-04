import * as React from 'react';
import { Button } from "react-bootstrap";
import { store } from "../../Utils/Redux/ConfigureStore";
import { startLoadProfile, changePage } from "../../Utils/Redux/SystemActions";
import { Page } from '../../Utils/Redux/SystemState';
import { Constants } from '../../Utils/Constants';

interface IProps {
    name: string;
    username: string;
    profileId: string;
}

interface IState {

}

export default class SearchUserComponent extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }

    onProfileClick = () => {
        console.log(this.props.profileId)
        Constants.profileId = this.props.profileId
        store.dispatch(changePage(Page.PROFILE))
    }

    render() {
        return (
            <div style={{margin: 10, backgroundColor:'lightyellow'}}>
                NAME: {this.props.name}
                USERNAME: {this.props.username}
                <br />
                <Button onClick={this.onProfileClick}>Open </Button>
            </div>
        )
    }
}