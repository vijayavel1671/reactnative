'use strict';
import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity, TextInput, Platform, ScrollView, AsyncStorage, Alert, KeyboardAvoidingView } from "react-native";
import css from "./style";
import { Languages, Style, Config, gAnalytics,Images } from "@common";
import { SpinkitLarge,TabBarIcon } from "@components";
import { RkAvoidKeyboard } from "react-native-ui-kitten";
import { inject, observer } from "mobx-react";
import styles from "../../../styles";


const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

@inject("stores")
@observer
export default class ContactUsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      name: '',
      email: '',
      phone: '',
      query: '',
      userid: null
    }
    gAnalytics.trackScreenView('ContactUsPage')
  }

  static navigationOptions = {
    title: 'Contact Us',
    headerMode: 'float',
  }

  componentWillMount() {
    this.handleAnalytics()
  }

  handleAnalytics() {
    AsyncStorage.getItem("usertoken")
      .then(item => {
        if (item) {
          // console.log("User logged in")
          this.props.stores.user.getuserInfoBasic()
            .then(data => {
              let d = JSON.parse(data)
              this.setState({
                userid: d.id, name: d.first_name + " " + d.last_name, email: d.email
              }, () => {
                gAnalytics.setUser(d.id.toString());
              })
            }).catch(err => console.log(err))
        }
        gAnalytics.trackEvent('contactus', 'view', { name: 'ContactUsPage' });
      }).catch(e => console.log(e))
  }

  /*Email validator*/
  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  btnContactUs() {
    let d = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      query: this.state.query
    };
    
    let regex_phone = /^[0-9]+$/
    let noinitialarr = [0,1,2,3,4,5,6];

    if (d.name.trim() !== "" && d.email.trim() !== "" && d.phone.trim() !== "" && d.query.trim() !== "") {
      let pnumber = d.phone.toString().split("");
      if (!this.validateEmail(d.email)) {
        Alert.alert("Invalid email address.");
      } else if (d.phone.length !== 10 || !regex_phone.test(d.phone) || noinitialarr.includes(parseInt(pnumber[0]))){
        Alert.alert("Invalid phone number.");
      } else {
        this.setState({ loading: true }, () => {

          this.props.stores.misc.submitContactUs(d)
          .then(res => {
            if (res.status == "success") {
              this.setState({ loading: false }, () => {
                gAnalytics.trackEvent('contactus', 'submit', { userId: this.state.userid, email: d.email });
              })
              Alert.alert(
                res.message,
                null,
                [{
                  text: "OK",
                  onPress: () => this.props.navigation.goBack()
                }
              ],
              { cancelable: false }
            );
          }
          else {
            this.setState({ loading: false })
            Alert.alert(res.message)
          }
        })
        .catch(err => console.log(err))
        })
      }
    }
    else {
      Alert.alert("One or more fields missing.")
      this.setState({ loading: false })
    }
  }

  render() {
    if (this.state.loading) {
      return (<SpinkitLarge />)
    }
    return (
	<View style={[styles.Container]}>
      <ScrollView>
        <KeyboardAvoidingView keyboardShouldPersistTaps={'handled'} behavior={'padding'} keyboardVerticalOffset={keyboardVerticalOffset}>
          <View style={css.body}>
            <View style={css.wrapForm}>
              {/*Email*/}
              <View style={css.textInputWrap}>
                <Text style={css.textLabel}>Email</Text>
                <Text style={[css.textLabel, { fontWeight: '400', fontSize: 11 }]} >
                  {"We'll never share your email with anyone else."}
                </Text>
                <TextInput underlineColorAndroid="transparent"
                  ref='emailInput'
                  returnKeyType={"next"}
                  keyboardType={'email-address'}
                  placeholder="Email address"
                  style={[css.textInput,{color:'#000'}]}
                  value={this.state.email}
                  editable={this.state.userid ? false : true}
                  onChangeText={(text) => this.setState({ email: text })}
                  onSubmitEditing={(e) => {
                    this.refs.nameInput.focus()
                  }}
                />
              </View>

              {/*Name*/}
              <View style={css.textInputWrap}>
                <Text style={css.textLabel}>Name</Text>
                <TextInput underlineColorAndroid="transparent"
                  ref='nameInput'
                  returnKeyType={"next"}
                  placeholder="Name"
                  value={this.state.name}
                  style={[css.textInput, { color: '#000' }]}
                  editable={this.state.userid ? false : true}
                  onChangeText={(text) => this.setState({ name: text })}
                  onSubmitEditing={(e) => {
                    this.refs.phoneInput.focus()
                  }}
                />
              </View>

              {/*Phone*/}
              <View style={css.textInputWrap}>
                <Text style={css.textLabel}>Phone Number</Text>
                <TextInput underlineColorAndroid="transparent"
                  ref='phoneInput'
                  returnKeyType={"next"}
                  keyboardType={'phone-pad'}
                  placeholder="Phone Number"
                  style={[css.textInput, { color: '#000' }]}
                  onChangeText={(text) => this.setState({ phone: text })}
                  onSubmitEditing={(e) => {
                    this.refs.queryInput.focus()
                  }}
                />
              </View>

              {/*Comment*/}
              <View style={css.textInputWrap}>
                <Text style={css.textLabel}>Query</Text>
                <TextInput underlineColorAndroid="transparent"
                  ref='queryInput'
                  multiline={true}
                  numberOfLines={5}
                  blurOnSubmit={true}
                  placeholder="Enter your query"
                  style={[css.textInput_large,{color:'#000'}]}
                  onChangeText={(text) => this.setState({ query: text })} />
              </View>


              {/*Buttons*/}
              <View style={css.wrapButton}>
                <TouchableOpacity style={css.btnLogIn}
                  onPress={this.btnContactUs.bind(this)}>
                  <Text style={css.btnLogInText}> {'Submit'} </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
	  
	  <View style={[Style.fixedFooter, { bottom: 0, flex: 1, flexDirection: 'row', justifyContent: 'flex-end'  }] }>
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
