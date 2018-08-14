'use strict';
import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity, TextInput, ScrollView, Switch, Picker, NetInfo } from "react-native";
import { Languages, Style } from "@common";
import { Spinkit } from "@components";

export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      isConnected: true
    }
  }

  componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
    }

    componentDidMount(){
       NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
    }

    _handleConnectionChange = (isConnected) => {
          console.log("NetStatus",isConnected)
          this.setState({isConnected})
    }; 



  render() {
    if(this.state.isConnected){
      return(
    <View style={Style.container}>
      <Text style={{ textAlign: 'center', fontSize: 22, marginTop: '35%' }}>Seems like you are offline :(.</Text>
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <TouchableOpacity onPress={() => {
          console.log("btn pressed");
        }} >
          <Text>
            {'Retry'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          console.log("btn pressed");
        }} >
          <Text>
            {'Settings'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
      )
    }else{
      return null
    }
  }
}
            