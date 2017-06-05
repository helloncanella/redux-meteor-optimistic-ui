import React, { Component } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';

Meteor.connect('ws://192.168.1.18:3000/websocket');//do this only once 

class App extends Component {

  render() {
    const { settings, todosReady } = this.props;
    return todosReady ? <h2>Ready</h2> : <h2>Not ready</h2>
  }

}

export default createContainer(params => {
  const handle = Meteor.subscribe('links');
  Meteor.subscribe('settings');

  return {
    todosReady: handle.ready(),
    settings: Meteor.collection('links').find()
  };
}, App)