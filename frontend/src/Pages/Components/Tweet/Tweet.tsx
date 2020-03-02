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
            <div style={{borderRadius: 10, background:'lightgrey', margin: 10}}>
                {this.props.content}
                {this.props.timestamp}
            </div>
        )
    }
}