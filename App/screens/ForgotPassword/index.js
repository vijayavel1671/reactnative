"use strict";
import React, { Component } from "react";
import {
  Alert,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  NativeModules,
  Platform,
  ToastAndroid
} from "react-native";
import css from "./style";
import { SpinkitLarge } from "@components";
import { Languages, Style , Config,gAnalytics } from "@common";
import { inject, observer, observable } from "mobx-react";

@inject("stores")
@observer
export default class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      appLoading: false,
      email: "",
      otp: false,
      otpdata: ""
    };

    gAnalytics.trackScreenView('ForgotPassword');
    gAnalytics.trackEvent('forgotpassword','view',{name : 'ForgotPasswordPage' });  
  }

  static navigationOptions = {
    title: "Forgot Password",
    headerMode: "screen"
  };

  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  btnForgot(){
    this.setState({ loading: true });
    if (!this.validateEmail(this.state.email)) {
      Alert.alert("Invalid Email");
      this.setState({ loading: false });
    } else {
      // valid email
      this.props.stores.user
        .forgotPassword(this.state.email)
        .then(res => {
          if(res.status == "success"){
            this.setState({ loading: false }, () => {
                  gAnalytics.trackEvent('forgotpassword','submit',{email : this.state.email})
            });
            this.props.navigation.navigate("ChangePasswordAfterForgot", {
              email: this.state.email,
              otp: res.otp
            });
          }else{
             this.setState({ loading: false });
                if (Platform.OS === "android") {
                    ToastAndroid.show(res.message, ToastAndroid.SHORT);
                  } else {
                    Alert.alert(res.message);
                  }
          }
        })
        .catch(err => console.log(err));
    }
  }

  render() {

    if (this.state.loading){
        return (<SpinkitLarge/>)
    }

    return (
      <View style={Style.container}>
        <View style={css.wrap}>
          <View style={(css.body, { justifyContent: "center" })}>
            <View style={(css.wrapForm, { justifyContent: "center" })}>
              <View style={css.textInputWrap}>
                <Text style={css.textLabel}>{Languages.email}</Text>
                <TextInput
                  keyboardType="email-address"
                  placeholder={Languages.enterEmail}
                  underlineColorAndroid="transparent"
                  style={css.textInput}
                  onChangeText={text => this.setState({ email: text })}
                />
              </View>
            </View>
          </View>
          <View style={(css.wrapButton,{ justifyContent: "center", alignSelf: "center", marginTop: 15 })}>
              <TouchableOpacity
                style={[Style.darkButton,{width:120}]}
                onPress={this.btnForgot.bind(this)}>
                <Text style={css.btnLogInText}> Submit </Text>
              </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}