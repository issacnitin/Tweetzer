import * as React from 'react';
import { Form, Button, FormText } from 'react-bootstrap'
import { store } from "../../../Utils/Redux/ConfigureStore";
import { startTweetPost } from "../Tweet/Redux/TweetActions";

interface IProps {

}

interface IState {
    tweetText: string;
    characterCount: number;
}

export class PostTweet extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            tweetText: "",
            characterCount : 0
        }
    }

    handleChange = (e: any) => {
        switch(e.target.name) {
            case "tweettext":
                this.setState({
                    tweetText: e.target.value,
                    characterCount: e.target.value.length
                })
                break;
            default:
                break;
        }
    }

    onPostTweetButtonClick = () => {
        store.dispatch(startTweetPost(this.state.tweetText, (new Date()).getTime()/1000));
    }

    render() {
        return (
            <div style={{width:'40%', alignItems: 'center', alignContent: "center"}}>
                <Form>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Post a tweet</Form.Label>
                        <Form.Control name="tweettext" as="textarea" rows="3" onChange={(e) => this.handleChange(e)} />
                    </Form.Group>
                </Form>
                <div style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
                    <FormText style={{flex:1}}>{this.state.characterCount}</FormText>
                    <Button style={{flex:1}} onClick={this.onPostTweetButtonClick} variant="primary">Post Tweet</Button>
                </div>
            </div>
        )
    }
}