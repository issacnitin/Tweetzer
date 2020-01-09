import React from "react"
import { Button, InputGroup, FormControl, Modal } from 'react-bootstrap'
import { store } from "../../../Utils/Redux/ConfigureStore"
import { signUp } from "./Redux/AuthenticationActions";

interface IProps {

}

interface IState {
    username: string;
    email: string;
    password: string;
}

export default class Login extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            username: "",
            email: "",
            password: ""
        }
    }

    onRegisterClick = () => {
        store.dispatch(signUp(this.state.username, this.state.email, this.state.password))
    }

    render() {
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
                        placeholder="Username"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
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
                            placeholder="darthvader@starwars.com"
                            aria-label="darthvader@starwars.com"
                            aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Confirm Password</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                            placeholder=""
                            aria-label=""
                            aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" onClick={this.onRegisterClick}>Register</Button>
                        <Button variant="secondary">Close</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        )
    }
}