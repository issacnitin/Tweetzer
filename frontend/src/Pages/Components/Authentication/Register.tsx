import React from "react"
import { Button, InputGroup, FormControl, Modal } from 'react-bootstrap'
import { store } from "../../../Utils/Redux/ConfigureStore"
import { startSignUp, signOut } from "./Redux/AuthenticationActions";

interface IProps {

}

interface IState {
    username: string;
    email: string;
    password: string;
    confirmpassword: string;
    formValid: boolean;
}

export default class Login extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            username: "",
            email: "",
            password: "",
            confirmpassword: "",
            formValid: true
        }
    }

    onRegisterClick = () => {
        this.validateForm();
        if(this.state.formValid) {
            store.dispatch(startSignUp(this.state.username, this.state.email, this.state.password));
        }
    }

    onCloseClick = () => {
        store.dispatch(signOut());
    }

    handleChange = (e: any) => {
        switch(e.target.name) {
            case "username":
                this.setState({
                    username: e.target.value
                });
                break;
            case "email":
                this.setState({
                    email: e.target.value
                });
            case "password":
                this.setState({
                    password: e.target.value
                });
                break;
            case "confirmpassword":
                this.setState({
                    confirmpassword: e.target.value
                });
                break;
            default:
                break;
        }
    }

    validateForm() {
        if(this.state.password.length == 0 || this.state.confirmpassword.length == 0 || this.state.username.length == 0 || this.state.email.length == 0) {
            this.setState({
                formValid: false
            });
            return;
        }
        if(this.state.password != this.state.confirmpassword) {
            this.setState({
                formValid: false
            });
            return;
        }
        let indexOfAt = this.state.email.indexOf('@');
        let indexOfDot = this.state.email.lastIndexOf('.');
        if(indexOfAt != -1 && indexOfDot != -1 && indexOfAt >= indexOfDot) {
            this.setState({
                formValid: false
            })
            return;
        }
        this.setState({
            formValid: true
        });
    }

    render() {

        let error: JSX.Element = <div />;
        if(!this.state.formValid) {
            if(this.state.password.length == 0 || this.state.confirmpassword.length == 0) {
                error = <div className="alert alert-primary" role="alert">
                            Form invalid
                        </div> 
            } else if(this.state.password != this.state.confirmpassword) {
                error = <div className="alert alert-primary" role="alert">
                            Passwords don't match
                        </div>
            } else {
                error = <div className="alert alert-primary" role="alert">
                            Form invalid
                        </div> 
            }
        } 
        
        return (
            <div>
                <Modal.Dialog>
                    <Modal.Header closeButton>
                        <Modal.Title>Register</Modal.Title>
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
                            onChange={this.handleChange}
                        />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                            placeholder="First and Last Name"
                            aria-label="First and Last Name"
                            aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                name="email"
                                placeholder="darthvader@starwars.com"
                                aria-label="darthvader@starwars.com"
                                aria-describedby="basic-addon1"
                                onChange={this.handleChange}
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
                                onChange={this.handleChange}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Confirm Password</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                name="confirmpassword"
                                placeholder=""
                                aria-label=""
                                aria-describedby="basic-addon1"
                                onChange={this.handleChange}
                            />
                        </InputGroup>
                    </Modal.Body>
                    {error}
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.onRegisterClick}>Register</Button>
                        <Button variant="secondary" onClick={this.onCloseClick}>Close</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        )
    }
}