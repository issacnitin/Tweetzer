import React from "react"
import { Button, InputGroup, FormControl, Modal } from 'react-bootstrap'
import { startSignIn, signOut } from "./Redux/AuthenticationActions";
import { store } from "../../../Utils/Redux/ConfigureStore";

interface IProps {

}

interface IState {
    username: string;
    password: string;
    signInFailed: boolean;
}

class Login extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        this.state = {
            username: "",
            password: "",
            signInFailed: false
        }

        store.subscribe(() => {
            let signInStatus = store.getState().Authentication.authToken == "";
            console.log(signInStatus);
            this.setState({
                signInFailed: signInStatus
            });
        })
    }

    onLoginClick = () => {
        store.dispatch(startSignIn(this.state.username, this.state.password))
    }
    
    onCloseClick = () => {
        store.dispatch(signOut())
    }
    
    handleChange = (e: any) => {
        switch(e.target.name) {
            case "username":
                this.setState({
                    username: e.target.value
                });
                break;
            case "password":
                this.setState({
                    password: e.target.value
                });
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <div>
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Login</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                            name="username"
                            placeholder="Username"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onChange={(e: any) => this.handleChange(e)}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                            name="password"
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-addon1"
                            onChange={(e: any) => this.handleChange(e)}
                            />
                        </InputGroup>
                    </Modal.Body>
                    { 
                        this.state.signInFailed ? 
                        <div className="alert alert-primary" role="alert">
                            Sign in failed!
                        </div> : 
                        <div />
                    }
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.onLoginClick}>Login</Button>
                        <Button variant="secondary" onClick={this.onCloseClick}>Close</Button>
                    </Modal.Footer>
                </Modal.Dialog>
                
            </div>
        )
    }
}

export default Login;