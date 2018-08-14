"use strict";
import React, { Component } from "react";
import {
  Alert,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  NativeModules
} from "react-native";
import css from "./style";
import { SpinkitLarge,TabBarIcon } from "@components";
import { Languages, Style,gAnalytics,Images } from "@common";
import { NavigationActions } from "react-navigation";
import { inject, observer, observable } from "mobx-react";

@inject("stores")
@observer
export default class ChangePasswordAfterForgotScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      appLoading: false,
      email: "",
      password: "",
      cnf_password: "",
      otpdata: ""
    };

    gAnalytics.trackScreenView('SetNewPassAfterForgotPage');
    gAnalytics.trackEvent('setnewpassword','view',{name : 'SetNewPassAfterForgotPage'});

  }

  static navigationOptions = {
    title: "Set New Password",
    headerMode: "screen"
  };

  _cp() {
    let emailid = this.props.navigation.state.params.email;

    if (this.state.password.trim() == "" || this.state.cnf_password.trim() == "" || this.state.otpdata.trim() == ""){
      Alert.alert("One or more fields missing.");
    } else if (this.state.password !== this.state.cnf_password){
      Alert.alert("Passwords don't match");
    } else {
      this.setState({ loading: true });
      this.props.stores.user
        .setNewPassAfterForgot(this.state.otpdata, emailid, this.state.password)
        .then(res => {
          if (res.status == "success") {
            this.setState({loading:false},() => {
              gAnalytics.trackEvent('setnewpassword','submit',{email : emailid})              
              const resetAction = NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: "Initial" })]
              });
              this.props.navigation.dispatch(resetAction);
            })
          } else {
            this.setState({loading:false})
            Alert.alert(res.message)
          }
        })
        .catch(err => {
          this.setState({loading:false})
          console.log(err)});
    }
  }

  render() {
    if(this.state.loading){
          return(<SpinkitLarge/>)
    }
    return (
      <View style={Style.container}>
        <View style={css.wrap}>
          <View style={[ { height: "90%", flexDirection: 'column', flex: 1, justifyContent: 'flex-start', }]}>
            {/*OTP FIELD*/}

            <View style={css.wrapForm}>
              <View style={css.textInputWrap}>
                <Text style={css.textLabel}>OTP</Text>
                <TextInput
                  value={this.state.otpdata}
                  placeholder="Enter OTP"
                  underlineColorAndroid="transparent"
                  style={css.textInput}
                  onChangeText={text => this.setState({ otpdata: text })}
                />
              </View>
            </View>

            <View style={css.wrapForm}>
              {/*password*/}
              <View style={css.textInputWrap}>
                <Text style={css.textLabel}>{Languages.passwordUp}</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder={Languages.enterPassword}
                  style={css.textInput}
                  secureTextEntry={true}
                  onChangeText={text => this.setState({ password: text })}
                />
              </View>
            </View>

            <View style={css.wrapForm}>
              {/*Confirm password*/}
              <View style={css.textInputWrap}>
                <Text style={css.textLabel}>Confirm Password</Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder={Languages.enterPassword}
                  style={css.textInput}
                  secureTextEntry={true}
                  onChangeText={text => this.setState({ cnf_password: text })}
                />
              </View>
            </View>
			
			<View style={css.wrapButton}>
				<TouchableOpacity
				  style={css.btnLogIn}
				  onPress={this._cp.bind(this)}>
				  <Text style={css.btnLogInText}> Submit </Text>
				</TouchableOpacity>
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
 
