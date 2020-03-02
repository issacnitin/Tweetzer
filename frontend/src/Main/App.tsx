import React from 'react';
import './App.css';
import LoggedOutHeader from './Header/LoggedOutHeader';
import { AppState, store } from '../Utils/Redux/ConfigureStore';
import LoggedInHeader from './Header/LoggedInHeader';
import { connect } from 'react-redux';
import { Page } from '../Utils/Redux/SystemState';
import Login from '../Pages/Components/Authentication/Login';
import Register from '../Pages/Components/Authentication/Register';
import Profile from '../Pages/Profile/Profile';
import Home from '../Pages/Home/Home';

interface IProps {

}

interface IState {
  loggedIn: boolean
  page: Page
}

class App extends React.Component<IProps, IState> {
  
  constructor(props: IProps) {
    super(props)
    this.state = {
      page: Page.DEFAULT,
      loggedIn: false
    }

    store.subscribe(() => {
      let state = store.getState()
      if(state.System.page != this.state.page) {
        console.log(state.System.page);
        console.log(this.state.page);
        this.setState({
          page: state.System.page,
          loggedIn: state.Authentication.authToken != ""
        });
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
        jsx = <Profile />
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