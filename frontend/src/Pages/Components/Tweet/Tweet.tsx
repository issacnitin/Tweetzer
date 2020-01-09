import React from "react";


interface IProps {
    content: string
    timestamp: number
}

interface IState {

}


export default class Tweet extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }

    render() {
        return (
            <div>
                {this.props.content}
                {this.props.timestamp}
            </div>
        )
    }
}