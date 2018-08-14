'use strict';
import React, {Component} from "react";
import {Text, View, Image, TouchableOpacity, TextInput,ScrollView,Switch,Picker} from "react-native";
import css from "../Forms/style";
import { Languages,Style, Images} from "@common";
import {Spinkit, TabBarIcon} from "@components";

export default class MyChatsScreen extends Component{
	  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

static navigationOptions = {
    title: 'My Chats',
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
            <Text style={{textAlign:'center',fontSize:22,marginTop:'35%'}}>My Chats coming soon !</Text>
        </View>
      </ScrollView>
	  <View style={Style.fixedFooter}>
							 <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}> 
								 <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
							 </TouchableOpacity>
							  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Designers')}> 
								 <TabBarIcon icon={Images.icons.user} tintColor={'#fff'} />
							 </TouchableOpacity>
							  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Favorites')}> 
								 <TabBarIcon icon={Images.icons.star} tintColor={'#fff'} />
							 </TouchableOpacity>
						</View>
    </View>
  		);
  }
}
