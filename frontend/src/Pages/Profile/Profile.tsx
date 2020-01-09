import React from "react"
import Mine from "./Mine"
import Others from "./Others"
import { store } from "../../Utils/Redux/ConfigureStore"

interface IProps {

}

interface IState {
    profileid?: string
    myid?: string
}

export default class Profile extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        let _state = store.getState()
        this.state = {
            profileid: _state.System.profileid,
            myid: _state.System.myid
        }

        store.subscribe(() => {
            let _state = store.getState()
            this.setState({
                profileid: _state.System.profileid
            })
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.profileid == this.state.myid ? 
                        <Mine />
                    :
                        <Others profileid={this.state.profileid} />
                }    
            </div>
        )
    }
}