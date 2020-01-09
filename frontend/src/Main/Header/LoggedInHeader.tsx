import React from "react";
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from "react-bootstrap";

interface IProps {

}

interface IState {

}

export default class LoggedInHeader extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
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
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-success">Search</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}