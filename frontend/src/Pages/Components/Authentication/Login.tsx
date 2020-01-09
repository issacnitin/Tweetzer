import React from "react"
import { Button, InputGroup, FormControl, Modal } from 'react-bootstrap'
import { startSignIn } from "./Redux/AuthenticationActions";
import { store } from "../../../Utils/Redux/ConfigureStore";

interface IProps {

}

interface IState {

}

class Login extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }

    onLoginClick = () => {
        store.dispatch(startSignIn("abc", "def"))
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
                        placeholder="Username"
                        aria-label="Username"
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
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="primary" onClick={this.onLoginClick}>Login</Button>
                        <Button variant="secondary">Close</Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        )
    }
}

export default Login;