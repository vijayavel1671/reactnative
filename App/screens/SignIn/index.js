"use strict";
import React, { Component } from "react";
import {
  Alert,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  AsyncStorage,
  Switch,
  Platform
} from "react-native";
import css from "./style";
import { Spinkit, TabBarIcon, SpinkitLarge } from "@components";
import { Languages, Style, Config, gAnalytics } from "@common";
import { NavigationActions } from "react-navigation";
import { SocialIcon } from "react-native-elements";
import { Images } from "@common";
import { inject, observer, observable } from "mobx-react";
import { GoogleSignin } from "react-native-google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk";
import moment from "moment";
import branch from 'react-native-branch' // <- import branch 

const APP_WIDTH = Dimensions.get("window").width;

@inject("stores")
@observer
export default class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      username: "",
      password: "",
      LoginStatus: false,
      isuserLoggedIn: false,
      loginTextGoogle: "Sign In With Google",
      loginTextFaceBook: "Sign In With Facebook",
      stateparams: "",
      hideSkip: this.props.hideSkip,
      showpass: false,
      secureEntry: true
    };

    this.btnLogIn = this.btnLogIn.bind(this);

    gAnalytics.trackScreenView('SignInPage');
    gAnalytics.trackEvent('signin','view',{name : 'SignInPage' });
  }

  componentWillMount(){
    if(Platform.OS == 'android'){
      GoogleSignin.configure({
              webClientId: Config.webClientId,
              offlineAccess: false
            });
    }
    /*Checking for 3 days window(testing with 5 hours,,,).......................*/
    AsyncStorage.getItem("expireGuestLoginTimeInit")
      .then(data => {
        if (!data) {
          var inidata = moment().format("DD/MM/YYYY HH:mm:ss");
          AsyncStorage.setItem("expireGuestLoginTimeInit", inidata);
        } else {
          var current = moment().format("DD/MM/YYYY HH:mm:ss");
          var d = moment(current, "DD/MM/YYYY HH:mm:ss").diff(
            moment(data, "DD/MM/YYYY HH:mm:ss")
          );
          var m = moment.duration(d);
          var Hours = Math.floor(m.asHours());
          if (Hours > 71){
            this.setState({ hideSkip: true });
          }
        }
      }).catch(err => console.log(err));


  }

  componentDidMount(){
        /*Configuring google keys.......................*/
        if(Platform.OS == 'ios'){
          GoogleSignin.configure({
            webClientId: Config.webClientId,
            iosClientId : '160302230949-6hhtsvdu36jdih9lhdolbomvlifemj30.apps.googleusercontent.com',
            scopes: ['openid', 'email', 'profile'],
            offlineAccess: false
          });
        }
  }

  togglePass(value) {
    this.setState({ showpass: value });
    if (value == true) {
      this.setState({ secureEntry: false });
    } else {
      this.setState({ secureEntry: true });
    }
  }

  _handleFacebookLogin = () => {
    /*In case user logged in with other account.....*/
    // LoginManager.logOut();
    //  console.log(AccessToken.getCurrentAccessToken())
    if (AccessToken.getCurrentAccessToken()){
      LoginManager.logOut();
    }
    this.setState({ loading: true }, () => {
      LoginManager.logInWithReadPermissions(["email", "public_profile"])
        .then(result => {
          // console.log(result.declinedPermissions)
          if (result.isCancelled){
              this.setState({ loading: false });
          }else if(result.declinedPermissions.length > 0){
              this.setState({ loading: false } , () => {
                Alert.alert("Check if requested permissions are granted.");
              });
          }else{
            AccessToken.getCurrentAccessToken()
              .then(data => {
                if(data.accessToken) {
                  this.logInwithFB(data.userID, data.accessToken);
                }
              })
              .catch(e => {
                // console.log("here 1");
                // console.log(e);
                this.setState({ loading: false });
              });
          }
        })
        .catch(error => {
          console.log("here 2");
          console.log(error);
          this.setState({ loading: false });
        });
    });
  };

  logInwithFB = (userID, accessToken) => {
    this.props.stores.user
      .LoginFacebook(userID, accessToken)
      .then(response => {
        if (response.status == "success") {
          this.props.stores.user.LoginStatus = true; //store observable
          AsyncStorage.setItem("usertoken", response.token);
          this.props.stores.user
            .setuserInfo(response.token)
            .then(res => {})
            .catch(e => console.log(e));
          AsyncStorage.multiSet([["usertype", "social"],["usertype_social","facebook"]])
                .then(s => { console.log(s)})
                .catch(e => console.log(e));
          this.setState({ loading: false, LoginStatus: true });
          // Ga
          gAnalytics.trackEvent('login','submit',{type : 'Facebook Login' });
          /* branch.setIdentity('theUserId') // <- Identifiy the user in branch */
          this.props.handleSignIn();
        }else{
          Alert.alert(response.message)
          this.setState({loading:false})
        }
      })
      .catch(error => console.log(error));
  };

  _handleGoogleLogin = () => {
    this.setState({ loading: true });
    const user = GoogleSignin.currentUser();
    if(user.length){
      GoogleSignin.signOut().then(() => { console.log('out'); }).catch((err) => { });
    }
    GoogleSignin.signIn()
      .then(user => {
        if (user.accessToken) {
          this.props.stores.user
            .LoginGoogle(user.accessToken)
            .then(response => {
              if (response.status == "success") {
                this.props.stores.user.LoginStatus = true; //store observable
                AsyncStorage.setItem("usertoken", response.token);
                this.props.stores.user
                  .setuserInfo(response.token)
                  .then(res => {})
                  .catch(e => console.log(e));
                AsyncStorage.multiSet([["usertype", "social"], ["usertype_social", "google"]])
                  .then(s => { console.log(s) })
                  .catch(e => console.log(e));
                this.setState({ loading: false, LoginStatus: true });
          // Ga
          gAnalytics.trackEvent('login','submit',{type : 'Google Login' });

                this.props.handleSignIn();
              } else {
                this.setState({ loading: false });
              }
            })
            .catch(error => {
              this.setState({ loading: false });
              console.log(error);
            });
        }
        // this.setState({user: user});
      })
      .catch(err => {
        console.warn("WRONG SIGNIN", err);
        this.setState({ loading: false });
      });
  };
  btnLogIn() {
    /*Start loader*/
    this.setState({ loading: true });
    /*Call for action...*/
    var data = {
      email: this.state.email,
      password: this.state.password
    };
    if(data.email && data.password){
      if (data.email.trim() == "" || data.password.trim() == "") {
        Alert.alert("One or more fields missing.");
        this.setState({ loading: false });
      }else {
        this.props.stores.user
          .verifylogin(data.email, data.password)
          .then(result => {
            if (result.status == "success") {
              this.props.stores.user.LoginStatus = true; //store observable
              AsyncStorage.setItem("usertoken", result.token);
              this.props.stores.user
                .setuserInfo(result.token)
                .then(res => { })
                .catch(e => console.log(e));
              AsyncStorage.multiSet([["usertype", "normal"], ["usertype_social", "none"]])
                .then(s => { console.log(s) })
                .catch(e => console.log(e));
              this.setState({ loading: false, LoginStatus: true });
              // Ga
              gAnalytics.trackEvent('login', 'submit', { type: 'Login' });

              this.props.handleSignIn();
            } else {
              Alert.alert("Wrong credentials try again.");
              this.setState({ loading: false, LoginStatus: false });
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }else{
      Alert.alert("One or more fields missing.");
      this.setState({ loading: false });
    }
 }

  render() {
    if (this.state.loading) {
      return <SpinkitLarge />;
    }

    return (
      <View style={[Style.container, Style.fullBody]}>
        <View style={[css.wrap]}>
          <View style={[css.body]}>
            <Image
              style={{
                width: 200,
                height: 100,
                marginBottom: 10,
                marginTop: 10,
                alignSelf: "center"
              }}
              resizeMode="contain"
              source={require("../../assets/Images/zingbi-gold-logo.png")}/>
            <View style={Style.boxWrapper}>
              
              <View style={(css.wrapForm, { justifyContent: "center" })}>
                <View style={css.textInputWrap}>
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor={'#999'}
                    underlineColorAndroid="transparent"
                    style={Style.input_field_txt}
                    onChangeText={text => this.setState({ email: text })}/>
                </View>

                <View style={css.textInputWrap}>
                  <TextInput
                    placeholder={Languages.enterPassword}
                    placeholderTextColor={'#999'}
                    underlineColorAndroid="transparent"
                    style={Style.input_field_txt}
                    secureTextEntry={this.state.secureEntry}
                    onChangeText={text => this.setState({ password: text })}
                  />
                </View>
              </View>

              {/*show password checkbox*/}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginTop: 15,
                  marginBottom: 25
                }}>
                <View style={{ width: APP_WIDTH - 100, alignSelf: "flex-start" }}>
                  <Text style={(css.textLabel, { fontSize: 15 })}>
                    Show password
                  </Text>
                </View>
                <View style={{ width: 50, alignSelf: "center" }}>
                  <Switch
                    onValueChange={this.togglePass.bind(this)}
                    style={{
                      marginBottom: 10,
                      marginTop: 28
                    }}
                    value={this.state.showpass}/>
                </View>
              </View>

              <View style={{ justifyContent: "center", marginTop: 15 }}>
                <View style={{ flexDirection: "row" }}>
                  {this.state.loading ? (
                    <TouchableOpacity style={[Style.darkButton]}>
                      <Spinkit />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[Style.darkButton, { elevation: 8 }]}
                      onPress={this.btnLogIn}>
                      <Text style={Style.darkButtonTxt}>
                        {" "}
                        {Languages.login}{" "}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#777",
                      alignSelf: "flex-end"
                    }}
                    onPress={() => this.props.navHandle("SignUp")}>
                    {" "}
                    {"Don't have an account ?"}{" "}
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-end",
                    flexDirection: "row"
                  }}>
                  <Text
                    style={{ fontSize: 15, flex: 1, color: "#000" }}
                    onPress={() => this.props.navHandle("ForgotPassword")}>
                    Forgot Password ?
                  </Text>

                  <View>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "#000",
                        alignSelf: "flex-end"
                      }}
                      onPress={() => this.props.navHandle("SignUp")}>
                      {" "}
                      Sign up now{" "}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
			 
			 <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                <SocialIcon
                  type="facebook"
                  onPress={this._handleFacebookLogin}
                  button={true}
                  style={[
                    Style.socialBtnCircle,
                    Style.socialBtnFB,
                    { elevation: 5 }
                  ]}
                  fontSize={8}/>
                <SocialIcon
                  type="google-plus-official"
                  onPress={this._handleGoogleLogin}
                  style={[
                    Style.socialBtnCircle,
                    Style.socialBtnGoogle,
                    { elevation: 5 }
                  ]}
                  button={true}
                  fontSize={8}/>
              </View>
			 
              <Text
                style={{ alignSelf: "center", fontSize: 18, marginTop: 30 }}
                onPress={
                  this.state.hideSkip
                    ? console.log("no skip")
                    : this.props.skipLogin
                }>
                {this.state.hideSkip ? "" : "Skip Login"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}