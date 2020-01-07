import React from 'react';
import Header from './Header/Header'
import './App.css';

interface IProps {

}

interface IState {

}


export default class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
  }

  render () {
    return (
      <div className="App">
        <Header />
      </div>
    );
  }
}

