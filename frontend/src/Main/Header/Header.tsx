import React from "react"
import { Button, InputGroup, FormControl, Modal } from 'react-bootstrap'
import Login from '../../Pages/Login'
import Register from '../../Pages/Register'

interface IProps {

}

interface IState {

}

export default class Header extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }

    render() {
        return (
            <div>
                <Button variant="primary">Login</Button>
                <Button variant="secondary">Register</Button>
            </div>
        )
    }
}