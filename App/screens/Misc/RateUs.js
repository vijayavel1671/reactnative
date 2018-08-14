'use strict';
import React, {Component} from "react";
import {Text, View, Image, TouchableOpacity, TextInput,ScrollView,Switch,Picker} from "react-native";
import css from "../Forms/style";
import { Languages,Style} from "@common";
import {Spinkit} from "@components";

export default class RateUsScreen extends Component{
	  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

static navigationOptions = {
    title: 'Rate Us',
    headerMode: 'float',
  }

  btnSignUp(){
  	console.log("yay");
  }

  render(){
  	return(
  	<View style={Style.container}>
      <ScrollView style={css.wrap}>
        <View style={css.body}>
            <Text style={{textAlign:'center',fontSize:22,marginTop:'35%'}}>Rate Us !</Text>
        </View>
      </ScrollView>
    </View>
  		);
  }
}
