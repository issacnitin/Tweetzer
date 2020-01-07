import React from "react"
import { Button, InputGroup, FormControl, Modal } from 'react-bootstrap'
import { store } from "../../Utils/Redux/ConfigureStore"
import { changePage } from "../../Utils/Redux/SystemActions"
import { Page } from "../../Utils/Redux/SystemState";

interface IProps {

}

interface IState {

}

export default class LoggedOutHeader extends React.Component<IProps, IState> {
    
    constructor(props: IProps) {
        super(props)
    }

    onLoginClick = () => {
        console.log("onLoginClick")
        store.dispatch(changePage(Page.LOGIN))
    }

    render() {
        return (
            <div>
                <Button variant="primary" onClick={this.onLoginClick}>Login</Button>
                <Button variant="secondary">Register</Button>
            </div>
        )
    }
}