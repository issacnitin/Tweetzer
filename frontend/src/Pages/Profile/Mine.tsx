import React from "react"
import Feed from '../Components/Tweet/Feed';

interface IProps {

}

interface IState {

}

export default class Mine extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
    }

    render() {
        return (
            <div>
                <Feed />
            </div>
        )
    }
}