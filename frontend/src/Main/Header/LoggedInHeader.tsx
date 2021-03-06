import React from "react";
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from "react-bootstrap";
import { store } from "../../Utils/Redux/ConfigureStore";
import { changePage, startLoadProfile, startSearchProfile } from "../../Utils/Redux/SystemActions";
import { Page } from '../../Utils/Redux/SystemState';
import { signOut } from "../../Pages/Components/Authentication/Redux/AuthenticationActions";
import { startTweetSearch, startTweetRefresh } from "../../Pages/Components/Tweet/Redux/TweetActions";
import { Constants } from "../../Utils/Constants";
import "./Header.css";

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
        Constants.username = store.getState().System.myusername
        store.dispatch(changePage(Page.PROFILE))
    }

    onSignoutClick = () => {
        store.dispatch(signOut())
    }

    onSearchButtonClick = () => {
        Constants.searchstring = encodeURIComponent(this.state.searchtext)
        store.dispatch(changePage(Page.SEARCH))
        store.dispatch(startTweetSearch(Constants.searchstring))
        store.dispatch(startSearchProfile(Constants.searchstring))
    }

    handleChange = (e: any) => {
        this.setState({
            searchtext: e.target.value
        })
    }

    render() {
        return (
            <div className="header">
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
                            <Button variant="outline-success" style={{margin: 10}} onClick={this.onSearchButtonClick} value={Constants.searchstring}>Search</Button>
                            <Button variant="secondary" style={{margin: 10}} onClick={this.onSignoutClick}>Sign Out</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}