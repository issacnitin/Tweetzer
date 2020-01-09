import React from "react"
import { Button } from "react-bootstrap";

interface IProps {

}

interface IState {

}

export default class FollowButton extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }

    onFollowButtonClick = () => {

    }
    
    render() {
        return (
            <div>
                <Button onClick={this.onFollowButtonClick}/>
            </div>
        )
    }
}