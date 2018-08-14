'use strict';
import React, {Component} from "react";
import {Text, View, Image, TouchableOpacity, TextInput,ScrollView,Switch,Picker} from "react-native";
import css from "../Forms/style";
import { Languages,Style,Images} from "@common";
import {Spinkit,TabBarIcon} from "@components";

export default class TCScreen extends Component{
	  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      hideHome : false
    }
  }

static navigationOptions = {
    title: 'Terms & Conditions',
    headerMode: 'float',
  }

  btnSignUp(){
  	console.log("yay");
  }

  onScrollEvent = (e) => {
    if (e.nativeEvent.contentOffset.y > 30) {
      this.setState({
        hideHome: true
      })
    } else {
      this.setState({
        hideHome: false
      })
    }
  }

  render(){
  	return(
  	<View style={Style.container}>
        <ScrollView style={css.wrap} onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
          onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}>
        <View style={css.body}>
            <Text style={{textAlign:'center',fontSize:22,marginTop:'35%'}}>Terms and Conditions</Text>
        </View>
      </ScrollView>
        {/*
          !this.state.hideHome ?
            <View style={[Style.fixedFooter, {
              width: 50, height: 50, borderRadius: 100,
              right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end'
            }]}>
              <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}>
                <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
              </TouchableOpacity>
            </View> : null
        */} 
		
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
