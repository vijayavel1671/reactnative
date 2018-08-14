"use strict";
import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Picker,
  Dimensions,
  AsyncStorage,
  Alert
} from "react-native";
import css from "./style";
import { Languages, Style, Images,gAnalytics } from "@common";
import { Spinkit,SpinkitLarge, TabBarIcon } from "@components";
import { inject, observer } from "mobx-react";
import { FormLabel, FormInput } from "react-native-elements";
import { NavigationActions } from "react-navigation";

const APP_WIDTH = Dimensions.get("window").width;

@inject("stores")
@observer
export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: "",
      password: "",
      cnf_password: "",
      fname: "",
      lname: "",
      gender: "",
      showpass: false,
      newsletterSub: true,
      secureEntry: true
    };

 // this.focusNextField = this.focusNextField.bind(this);

 this.inputs = {};

 gAnalytics.trackScreenView('SignUpPage');
 gAnalytics.trackEvent('signup','view',{name:'SignUpPage'})


  }

  static navigationOptions = {
    title: "Sign Up",
    headerMode: "screen",
    tabBarIcon: ({ tintColor }) => (
      <TabBarIcon icon={Images.icons.user} tintColor={tintColor} />
    )
  };

  componentWillMount() {
        this.props.stores.user.checkUserToken()
          .then(tkn => {
              if(tkn){
                  this.props.navigation.goBack()
              }
          })
          .catch(e => console.log(e))
  }

    focusNextField(key){
    this.inputs[key].focus();
  }

  /*Email validator*/
  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  btnSignUp() {
    var d = this.state;
    d.password = d.password.trim()
    d.cnf_password = d.cnf_password.trim()

    if (d.fname == "") {
      Alert.alert("First name is required.");
    } else if (d.lname == "") {
      Alert.alert("Last name is required.");
    } else if (d.email == "") {
      Alert.alert("Email is required.");
    }else if (d.password == "") {
      Alert.alert("Password is required.");
    } else if (d.cnf_password == "") {
      Alert.alert("Confirm Password is required.");
    } else if (d.cnf_password !== d.password) {
      Alert.alert("Passwords don't match.");
    } else if (d.password.length < 6) {
      Alert.alert("Password length should be at least 6 characters long.");
    } else if(!this.validateEmail(d.email)){
      Alert.alert("Invalid email address.");
    } 
    else{   
      this.setState({loading:true})
    this.props.stores.user
      .registerUser(d)
      .then(result => {
        if (result.status == "success") {
          this.props.stores.user.LoginStatus = true; //store observable
          this.setState({ loading: false, LoginStatus: true }, () => {
              AsyncStorage.setItem("usertoken", result.token)
                .then(success => {
                   gAnalytics.trackEvent('register','submit',{type : 'SignUp'}) 
                   this.props.navigation.navigate('default')
                }).catch(e => console.log(e))
          });
        }else{
            if(result.messages.email[0]){
                Alert.alert(result.messages.email[0])
            }
           this.setState({ loading: false});  
        }
      })
      .catch(error => {
        console.log(error);
      });
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
    if(this.state.loading){
      return (<SpinkitLarge/>)
    }
    return (
      <View style={Style.container}>
        <ScrollView style={css.wrap}>
          <View style={css.body}>
            <View style={css.wrapForm}>

              {/*Firstname*/}

                <TextInput
                   ref={'fname_field'}
                  onSubmitEditing={(e) => {
                    this.refs.lname_field.focus()
                  }}   
                  returnKeyType={ "next" }                    
                  placeholder="Enter your first name"
                  placeholderTextColor={'#999'}
                  underlineColorAndroid="transparent"
                  style={[Style.input_field_txt,{marginBottom : 8}]}
                  onChangeText={text => this.setState({ fname: text })}           
                />


              {/*Lastname*/}

                <TextInput
                   ref={'lname_field'}          
                onSubmitEditing={(e) => {
                    this.refs.email_field.focus();
                  }}   
                  returnKeyType={ "next" }                              
                  placeholder="Enter your last name"
                  placeholderTextColor={'#999'}
                  underlineColorAndroid="transparent"
                  style={[Style.input_field_txt,{marginBottom : 8}]}
                  onChangeText={text => this.setState({ lname: text })}
                />

              {/*Email*/}

                <TextInput
                   ref={'email_field'}  
                  onSubmitEditing={(e) => {
                    this.refs.pass_field.focus();
                  }}       
                  returnKeyType={ "next" }                            
                  underlineColorAndroid="transparent"
                  keyboardType="email-address"
                  placeholder={Languages.enterEmail}
                  placeholderTextColor={'#999'}
                  style={[Style.input_field_txt,{marginBottom : 8}]}
                  onChangeText={text => this.setState({ email: text })}
                />

              {/*password*/}

                <TextInput
                   ref={'pass_field'}  
                  onSubmitEditing={(e) => {
                    this.refs.cnf_pass_field.focus();
                  }}   
                  returnKeyType={ "next" }                              
                  underlineColorAndroid="transparent"
                  placeholder={Languages.enterPassword}
                  placeholderTextColor={'#999'}
                  style={[Style.input_field_txt,{marginBottom : 8}]}
                  secureTextEntry={this.state.secureEntry}
                  onChangeText={text => this.setState({ password: text })}  
                />

              {/*Confirm password*/}

                <TextInput
                   ref={'cnf_pass_field'}    
                  returnKeyType={ "done" }                           
                  underlineColorAndroid="transparent"
                  placeholder="Confirm your password"
                  placeholderTextColor={'#999'}
                  style={[Style.input_field_txt,{marginBottom : 8}]}
                  secureTextEntry={this.state.secureEntry}
                  onChangeText={text => this.setState({ cnf_password: text })}
                />


              {/*show password checkbox*/}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginTop: 15,
                  marginBottom: 15
                }}>
                <View
                  style={{ width: APP_WIDTH - 80, alignSelf: "flex-start", }}>
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
                      alignSelf: "flex-end",
                      marginRight: 5
                    }}
                    value={this.state.showpass}
                  />
                </View>
              </View>

              {/*Buttons*/}

              <View style={css.wrapButton}>
                  <TouchableOpacity
                    style={Style.darkButton}
                    onPress={this.btnSignUp.bind(this)}>
                    <Text style={css.btnLogInText}> {Languages.signup} </Text>
                  </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
