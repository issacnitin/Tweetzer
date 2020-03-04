import React from "react";
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from "react-bootstrap";
import { store } from "../../Utils/Redux/ConfigureStore";
import { changeToMyProfile, changePage, changeToProfile } from "../../Utils/Redux/SystemActions";
import { Page } from '../../Utils/Redux/SystemState';
import { signOut } from "../../Pages/Components/Authentication/Redux/AuthenticationActions";
import { startTweetSearch, startTweetRefresh } from "../../Pages/Components/Tweet/Redux/TweetActions";

interface IProps {

}

interface IState {
    searchtext: string
}

export default class LoggedInHeader extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            searchtext: ""
        }
    }

    onClickHome = () => {
        store.dispatch(startTweetRefresh())
        store.dispatch(changePage(Page.HOME))
    }

    onClickProfile = () => {
        store.dispatch(changeToMyProfile())
    }

    onSignoutClick = () => {
        store.dispatch(signOut())
    }

    onSearchButtonClick = () => {
        store.dispatch(startTweetSearch(this.state.searchtext))
        store.dispatch(changePage(Page.HOME))
    }

    handleChange = (e: any) => {
        this.setState({
            searchtext: e.target.value
        })
    }

    render() {
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home">Tweetzer</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        <Nav.Link onClick={this.onClickHome}>Home</Nav.Link>
                        <Nav.Link onClick={this.onClickProfile} >Profile</Nav.Link>
                        </Nav>
                        <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={(e: any) => this.handleChange(e)} />
                            <Button variant="outline-success" style={{margin: 10}} onClick={this.onSearchButtonClick}>Search</Button>
                            <Button variant="secondary" style={{margin: 10}} onClick={this.onSignoutClick}>Sign Out</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}