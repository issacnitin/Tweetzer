import React from "react"
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from "react-bootstrap";
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
        store.dispatch(changePage(Page.LOGIN))
    }

    onRegisterClick = () => {
        store.dispatch(changePage(Page.SIGNUP));
    }

    render() {
        return (
            <div className="header">
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home">Tweetzer</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        <Nav.Link href="#home"></Nav.Link>
                        </Nav>
                        <Form inline>
                            <Button variant="primary" onClick={this.onLoginClick} style={{margin: 10}}>Login</Button>
                            <Button variant="secondary" onClick={this.onRegisterClick} style={{margin: 10}}>Register</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}