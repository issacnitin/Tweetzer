import React from "react"
import Feed from '../Components/Tweet/Feed';

interface IProps {
    profileid?: string
}

interface IState {

}

export default class Others extends React.Component<IProps, IState> {
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