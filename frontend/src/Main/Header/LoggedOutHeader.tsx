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
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home">Twitzer</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        </Nav>
                        <Form inline>
                            <Button variant="primary" onClick={this.onLoginClick}>Login</Button>
                            <Button variant="secondary" onClick={this.onRegisterClick}>Register</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}