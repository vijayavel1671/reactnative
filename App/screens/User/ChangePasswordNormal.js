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
  Switch,
  Dimensions,
  StyleSheet
} from "react-native";
import css from "./style";
import { SpinkitLarge, TabBarIcon } from "@components";
import { Languages, Style, gAnalytics, Images } from "@common";
import { NavigationActions } from "react-navigation";
import { inject, observer, observable } from "mobx-react";

const APP_WIDTH = Dimensions.get("window").width;

@inject("stores")
@observer
export default class ChangePasswordNormalScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      appLoading: false,
      token: '',
      old_password: '',
      new_password: '',
      cnf_password: '',
      showpass: false,
      secureEntry: true,
    };
    gAnalytics.trackScreenView('ChangePasswordPage')
  }

  static navigationOptions = {
    title: "Change Password",
    headerMode: "screen"
  };

  componentWillMount() {
    let token = this.props.navigation.state.params.token;
    this.setState({ token }, () => {
      this.props.stores.user.getuserInfoBasic()
        .then(data => {
          let d = JSON.parse(data)
          gAnalytics.setUser(d.id.toString());
          gAnalytics.trackEvent('changepassword', 'view', { name: 'ChangePasswordPage' })
        }).catch(err => console.log(err))
    })
  }

  _cp() {
    this.setState({ loading: true });
    //this.props.navigation.navigate("SignIn"); setNewPassAfterForgot
    if (this.state.new_password !== this.state.cnf_password) {
      Alert.alert("Passwords don't match");
      this.setState({ loading: false });
    } else if (this.state.new_password.trim().length < 6 || this.state.cnf_password.trim().length < 6) {
      Alert.alert("The password must be at least of 6 characters");
      this.setState({ loading: false });
    } else {
      this.props.stores.user.setNewPass(this.state.old_password, this.state.new_password, this.state.token)
        .then(res => {
          if (res.status == "success") {
            Alert.alert(res.message)
            this.setState({ loading: false, old_password: '', new_password: '', cnf_password: '' }, () => {
              gAnalytics.trackEvent('changepassword', 'submit', { name: 'ChangePasswordPage' })
            });
            // qthis.props.navigation.goBack();
          } else {
            this.setState({ loading: false });
            Alert.alert("something went wrong")
          }
        })
        .catch(err => console.log(err))
    }
  }

  togglePass(value) {
    this.setState({ showpass: value });
    console.log(value);
    if (value == true) {
      console.log("true");
      this.setState({ secureEntry: false });
    } else {
      console.log("false");
      this.setState({ secureEntry: true });
    }
  }

  render() {
    if (this.state.loading) {
      return (<SpinkitLarge />)
    }
    return (
      <View style={Style.container}>

        <View style={css.wrap}>
          <View style={[css.body, { height: '90%' }]}>
            {/*OTP FIELD*/}
            <View style={css.textInputWrap}>
              <Text style={css.textLabel}>Old Password</Text>
              <TextInput
                value={this.state.old_password}
                placeholder="Enter Old password"
                underlineColorAndroid="transparent"
                secureTextEntry={true}
                style={css.textInput}
                onChangeText={(text) => this.setState({ old_password: text })} />
            </View>

            <View style={css.textInputWrap}>
              <Text style={css.textLabel}>
                New Password
                      </Text>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="Enter New Password"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  this.focusNextField("four");
                }}
                style={css.textInput}
                returnKeyType={"next"}
                secureTextEntry={this.state.secureEntry}
                onChangeText={text => this.setState({ new_password: text })}
              />
            </View>

            <View style={css.textInputWrap}>
              <Text style={css.textLabel}>
                Confirm Password
                      </Text>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="Confirm new password"
                style={css.textInput}
                secureTextEntry={this.state.secureEntry}
                onChangeText={text =>
                  this.setState({ cnf_password: text })}
              />
            </View>
            {/*show password checkbox*/}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                marginTop: 15,
                marginBottom: 15
              }}
            >
              <View
                style={{
                  width: APP_WIDTH - 80,
                  alignSelf: "flex-start"
                }}>
                <Text style={(css.textLabel, { fontSize: 15 })}>
                  Show password
                        </Text>
              </View>
              <View style={{ width: 40, alignSelf: "flex-end" }}>
                <Switch
                  onValueChange={this.togglePass.bind(this)}
                  style={{
                    marginBottom: 10,
                    marginTop: -10,
                    alignSelf: "flex-end"
                  }}
                  value={this.state.showpass} />
              </View>
            </View>
          </View>

        </View>
        <View style={[css.wrapButton,{marginBottom:40}]}>
          <TouchableOpacity
            style={css.btnLogIn}
            onPress={this._cp.bind(this)}>
            <Text style={css.btnLogInText}> Submit </Text>
          </TouchableOpacity>
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
