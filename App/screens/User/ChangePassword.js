'use strict';
import React, {Component} from "react";
import {Alert, Text, View, Image, TouchableOpacity, TextInput, NativeModules} from "react-native";
import css from "./style";
import {Spinkit, TabBarIcon} from "@components";
import {Languages,Style,Config, Images} from '@common';

export default class ChangePasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      appLoading: false,
      email: ''
    }
  }

      static navigationOptions = {
    title: 'Forgot Password',
    headerMode: 'screen',
  }

    btnForgot() {
    this.setState({loading: true});
          this.props.navigation.navigate('UserProfileScreen');
			}

  render() {
  	    return (

          <View style={Style.container}>
          <View style={css.wrap}>
            <View style={css.body}>
              <View style={css.wrapForm}>

                <View style={css.textInputWrap}>
                  <Text style={css.textLabel}>{Languages.email}</Text>
                  <TextInput
                    keyboardType = 'email-address'
                    placeholder={Languages.enterEmail}
                    underlineColorAndroid="transparent"
                    style={css.textInput}
                    onChangeText={(text) => this.setState({email: text})} />
                </View>
              </View>

              <View style={css.wrapButton}>
                {this.state.loading ?
                  <TouchableOpacity style={css.btnLogIn}>
                    <Spinkit />
                  </TouchableOpacity> :

                  <TouchableOpacity style={css.btnLogIn} onPress={this.btnForgot.bind(this)}>
                    <Text style={css.btnLogInText}> Submit </Text>
                  </TouchableOpacity>
                }

                </View>

              </View>
            </View>
			
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
