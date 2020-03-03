import React from 'react';
import './App.css';
import LoggedOutHeader from './Header/LoggedOutHeader';
import { AppState, store } from '../Utils/Redux/ConfigureStore';
import LoggedInHeader from './Header/LoggedInHeader';
import { ProfileModal } from '../Utils/Redux/SystemState';
import { Page } from '../Utils/Redux/SystemState';
import Login from '../Pages/Components/Authentication/Login';
import Register from '../Pages/Components/Authentication/Register';
import Profile from '../Pages/Components/Profile/Profile';
import Home from '../Pages/Home/Home';
import { startSignIn } from "../Pages/Components/Authentication/Redux/AuthenticationActions";

interface IProps {

}

interface IState {
  loggedIn: boolean
  page: Page
  profile?: ProfileModal
}

class App extends React.Component<IProps, IState> {
  
  constructor(props: IProps) {
    super(props)
    let username = localStorage.getItem('username');
    let password = localStorage.getItem('password');
    if(username != null && password != null) {
      store.dispatch(startSignIn(username, password))
    }
    
    this.state = {
      page: Page.DEFAULT,
      loggedIn: false,
      profile: undefined
    }

    store.subscribe(() => {
      let state = store.getState()
      if(state.System.page != this.state.page) {
        this.setState({
          page: state.System.page,
          loggedIn: !!state.Authentication.authToken && state.Authentication.authToken != ""
        });
      }
      if(this.state.profile == null) {
        this.setState({
          profile: state.System.profile
        })
      }
    })
  }

  render () {
    let jsx: JSX.Element = <div />;

    switch(this.state.page) {
      case Page.LOGIN:
        jsx = <Login />
        break;
      case Page.SIGNUP:
        jsx = <Register />
        break;
      case Page.HOME:
        jsx = <Home />
        break;
      case Page.PROFILE:
        jsx = !!this.state.profile ? <Profile modal={this.state.profile}/> : <div/>
        break;
      default:
        jsx = <div />
        break;
    }

    return (
      <div className="App">
        {
          this.state.loggedIn ? 
            <LoggedInHeader />
          : 
            <LoggedOutHeader />
        }
        {jsx}
      </div>
    );
  }
}

export default App;