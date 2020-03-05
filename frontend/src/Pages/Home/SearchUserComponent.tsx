import * as React from 'react';
import { Button } from "react-bootstrap";
import { store } from "../../Utils/Redux/ConfigureStore";
import { startLoadProfile, changePage } from "../../Utils/Redux/SystemActions";
import { Page } from '../../Utils/Redux/SystemState';
import { Constants } from '../../Utils/Constants';

interface IProps {
    name: string;
    username: string;
}

interface IState {

}

export default class SearchUserComponent extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }

    onProfileClick = () => {
        Constants.username = this.props.username
        store.dispatch(changePage(Page.PROFILE))
    }

    render() {
        return (
            <div style={{backgroundColor:'lightblue', margin: 10, padding: 10, borderRadius: 10}}>
                {this.props.name}
                {this.props.name.length > 0 ? <br /> : <div /> }
                <a href="#" onClick={this.onProfileClick}>@{this.props.username}</a>
            </div>
        )
    }
}