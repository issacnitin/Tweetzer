import React from "react"
import { Button, InputGroup, FormControl, Modal } from 'react-bootstrap'
import { store } from "../../../Utils/Redux/ConfigureStore"
import { startSignUp, signOut } from "./Redux/AuthenticationActions";
import IdentityAPI from "../../../Utils/Network/IdentityAPI";

interface IProps {

}

interface IState {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmpassword: string;
    formValid: boolean;
    validUsername: boolean;
}

export default class Login extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            name: "",
            username: "",
            email: "",
            password: "",
            confirmpassword: "",
            formValid: true,
            validUsername: true
        }
    }

    onRegisterClick = () => {
        this.validateForm()
        .then((res: boolean) => {
            if(res) {
                store.dispatch(startSignUp(this.state.name, this.state.username, this.state.email, this.state.password));
            }
        })
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
                this.validateUsername(e.target.value);
                break;
            case "email":
                this.setState({
                    email: e.target.value
                });
                break;
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
            case "name":
                this.setState({
                    name: e.target.value
                });
            default:
                break;
        }
    }

    validateUsername = (username: string) => {
        if(username.length == 0) {
            this.setState({
                validUsername: false
            })
        }
        let identityController = new IdentityAPI();
        identityController.checkUsername(username)
        .then((res) => {
            this.setState({
                validUsername: res.body["result"]
            })
        })
        .catch((err) => {
            this.setState({
                validUsername: false
            })
        })
    }

    validateForm() {
        return new Promise<any>((resolve) => {

            if(this.state.password.length == 0 || this.state.confirmpassword.length == 0 || this.state.username.length == 0 || this.state.email.length == 0) {
                this.setState({
                    formValid: false
                });
                resolve(false)
                return;
            }
            if(this.state.password != this.state.confirmpassword) {
                this.setState({
                    formValid: false
                });
                resolve(false)
                return;
            }
            let indexOfAt = this.state.email.indexOf('@');
            let indexOfDot = this.state.email.lastIndexOf('.');
            if(indexOfAt == -1 || indexOfDot == -1 || indexOfAt >= indexOfDot) {
                this.setState({
                    formValid: false
                })
                resolve(false)
                return;
            }
            this.setState({
                formValid: this.state.validUsername
            });
            resolve(true)
        })
    }

    render() {

        let error: JSX.Element = <div />;
        if(!this.state.validUsername) {
            error = <div className="alert alert-primary" role="alert">
                        Empty username or username already exist
                    </div> 
        
        } else if(!this.state.formValid) {
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
                            name="name"
                            placeholder="First and Last Name"
                            aria-label="First and Last Name"
                            aria-describedby="basic-addon1"
                            onChange={this.handleChange}
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
                                type="password"
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
                                type="password"
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