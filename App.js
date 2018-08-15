import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { authorize } from 'react-native-app-auth';
// import { Button } from 'react-native-elements';

import { okta, hydra } from './configs'

const scopes = ['openid', 'profile', 'email', 'offline_access'];

export default class App extends Component {
  state = { accessToken: 'no information yet', response: ''}

  authorize = async () => {
    try{
      const result = await authorize(okta);
      this.setState({
        accessToken: result.accessToken,
        response: result
      });
      } catch (error) {
       console.error(error);
      }
   };

  render() {
    return (
      <View>
        <Text>
          {this.state.accessToken}
        </Text>
        <Text onPress={this.authorize}>
          Get Authorization
        </Text>
      </View>
    )
  }
}
