import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  AsyncStorage,
  TextInput,
  Alert,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  Switch,
  Platform,
  ToastAndroid,
  Picker,
  RefreshControl
} from "react-native";
import { NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import { SpinkitLarge, TabBarIcon } from "@components";
import { Languages, Style, Images, Config, gAnalytics } from "@common";
import { inject, observer, observable } from "mobx-react";
import { Avatar } from "react-native-elements";
import css from "../SignIn/style";
import ostyles from "../../../styles";
import SignInScreen from "../SignIn";
import ImagePicker from 'react-native-image-picker';
import UserProfileInfoScreen from './ProfileInfo';

import { GoogleSignin } from "react-native-google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk";

// Import branch and BranchEvent
import branch, { BranchEvent } from 'react-native-branch';

const APP_WIDTH = Dimensions.get("window").width;
const APP_HEIGHT = Dimensions.get("window").height;

@inject("stores")
@observer
export default class UserProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideSkip: true,
      loading: true,
      userdata: this.props.stores.user.userdata,
      userdata_ispresent: false,
      animating: true,
      token: null,
      editModal: false,
      email: '',
      first_name: '',
      last_name: '',
      submitText: "UPDATE",
      recentdata: [],
      recentdata_present: false,
      country: '',
      state: '',
      city_name: '',
      countrydata: [],
      citydata: [],
      statedata: [],
      address1: '',
      address2: '',
      citylist: false,
      usertype_social: false,
      refreshing: false,
      profile_pic: '',
      form_profile_pic: null,
      mobile: '',
      selectedImage: false,
      is_newsletter_subscribed: true,
      city: '',
      company_name: '',
      telephone_no: '',
      zipcode: '',
      hideHome : false,
      utype_social_val : false,
    };

    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    this.logout = this.logout.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.navHandle = this.navHandle.bind(this);
    this.handleNaviParent = this.handleNaviParent.bind(this);

    gAnalytics.trackScreenView('User Profile');
    gAnalytics.trackEvent('Screen', 'User Profile');
  }

  static navigationOptions = {
    title: "My Account",
    headerMode: "screen",
    gesturesEnabled: false
  };

  componentWillMount() {
    AsyncStorage.multiGet(['usertype', 'usertype_social','usertoken'])
      .then(res => {
        let usertype = res[0][1]   //usertype
        let utype_social_val = res[1][1]   //usertype_social
        let token = res[2][1]   //usertoken
        
        if (token){
          this.setState({ token: token }, () => {
            this.setUserData(token);
            /* ****** */
              if (usertype == "social") {
                this.setState({ usertype_social: true, utype_social_val: utype_social_val });
              } else {
                this.setState({ usertype_social: false, utype_social_val: utype_social_val });
              }
            /* ***** */
          });
        } else {
          this.setState({ userdata_ispresent: false, loading: false });
        }       
      }).catch(e => {
        console.log(e);
        
      })
  }

  componentDidMount() {
    AsyncStorage.getItem("usertoken")
      .then(item => {
        if (item) {
          this.setState({ token: item });
          this.getCountries();
          this.getStates();
          this.getCities();
        } else {
          this.setState({ userdata_ispresent: false, loading: false });
        }
      })
      .catch(err => console.log(err));
  }

  handleSignIn() {
    AsyncStorage.removeItem("expireGuestLoginTimeInit")
      .then(res => console.log(res))
      .catch(e => console.log(e))
    this.props.navigation.navigate('Initial');
  }

  navHandle(screen) {
    this.props.navigation.navigate(screen);
  }

  handleNaviParent(data) {
    this.props.navigation.navigate(data.name, { id: data.id });
  }

  setUserData(tkn) {
    this.props.stores.user
      .getUserdetails(tkn)
      .then(success => {
        if (success.user_detail) {
          this.setState({
            userdata: success,
            userdata_ispresent: true,
            animating: false,
            uid: success.user.id,
            first_name: success.user.first_name,
            last_name: success.user.last_name,
            loading: false,
            address1: success.user_detail.address1,
            address2: success.user_detail.address2,
            city: success.user_detail.city_id,
            company_name: success.user_detail.company_name == 'undefined' ? '' : success.user_detail.company_name ,
            country: success.user_detail.country_id,
            is_newsletter_subscribed: success.user_detail.is_newsletter_subscribed == 1 ? true : false,
            mobile: success.user_detail.mobile == 'undefined' ? '' : success.user_detail.mobile, 
            state: success.user_detail.state_id,
            telephone_no: success.user_detail.telephone_no == 'undefined' ? '' : success.user_detail.telephone_no ,
            zipcode: success.user_detail.zipcode,
            profile_pic: success.user_detail.profile_pic
          }, () => {
            this.setState({
              email : this.state.userdata.user.email.toString().indexOf('facebook') >= 0 ? '<Unknown>' : this.state.userdata.user.email 
            }, () => {
              gAnalytics.trackEvent('Profile', 'User Profile', {
                name: this.state.first_name + " " + this.state.last_name,
                email: this.state.userdata.user.email
              });
            })
          });
        } else {
          this.setState({
            userdata: success,
            uid: success.user.id,
            userdata_ispresent: true,
            animating: false,
            first_name: success.user.first_name,
            last_name: success.user.last_name,
            loading: false
          }, () => {
            this.setState({
              email: this.state.userdata.user.email.toString().indexOf('facebook') >= 0 ? '<Unknown>' : this.state.userdata.user.email
            },() => {
              gAnalytics.trackEvent('Profile', 'User Profile', {
                name: this.state.first_name + " " + this.state.last_name,
                email: this.state.userdata.user.email
              });
            });
          })
        }
      })
      .catch(err => console.log(err));

  /*Check if recently viewed data is present too....*/
    this.props.stores.partner
      .recentViewStores(tkn)
      .then(success => {
        if (success.status == "success") {
          this.setState({
            recentdata: success.recently_viewed,
            recentdata_present: true
          });
        } else {
          this.setState({
            recentdata: success.recently_viewed,
            recentdata_present: false
          });
        }
      })
      .catch(err => console.log(err));
  }

  getCountries(){
    this.props.stores.misc
      .getCountries()
      .then(res => {
        this.setState({ countrydata: res });
      })
      .catch(err => console.log(err));
  }

  getStates(){
    this.props.stores.misc
      .getStatesAll()
      .then(res => {
        this.setState({ statedata: res });
      })
      .catch(err => console.log(err));
  }

  getCities(){
    this.props.stores.misc
      .getAllCities()
      .then(res => {
        this.setState({ citydata: res });
      })
      .catch(err => console.log(err));
  }

  upDateCountry = country => {
    this.setState({ country });
    /*Change list of states....*/
    this.props.stores.misc
      .getStatesByCntryid(country)
      .then(res => {
        this.setState({ statedata: res });
      })
      .catch(err => console.log(err));
  };

  upDateState = state => {
    this.setState({ state });
    this.props.stores.misc
      .getCitiesByState(state)
      .then(res => {
        this.setState({ citydata: res });
      })
      .catch(err => console.log(err));
  };

  upDateCity = city => {
    this.setState({ city });
  };

  update() {
    let d = {
      token: this.state.token,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      address1: this.state.address1 ? this.state.address1 : '',
      address2: this.state.address2 ? this.state.address2 : '',
      city: this.state.city ? this.state.city : '',
      company_name: this.state.company_name ? this.state.company_name : '',
      country: this.state.country ? this.state.country : '',
      is_newsletter_subscribed: this.state.is_newsletter_subscribed ? 1 : 0,
      mobile: this.state.mobile ? this.state.mobile : '',
      state: this.state.state ? this.state.state : '',
      telephone_no: this.state.telephone_no ? this.state.telephone_no : '',
      zipcode: this.state.zipcode ? this.state.zipcode : '',
      profile_pic: this.state.form_profile_pic,
    };

    var regex = /^[0-9a-zA-Z\_ ]+$/
    var regex_name = /^[a-zA-Z\ ]+$/
    // (regex.test(fn))
    let regex_phone = /^[0-9]+$/
    let noinitialarr = [0, 1, 2, 3, 4, 5, 6];
    let pnumber = d.mobile.trim().toString().split("");

    if (d.first_name.trim() == "") {
      Alert.alert("First name is required.");
    } else if (d.last_name.trim() == "") {
      Alert.alert("Last name is required.");
    } else if (d.first_name.trim() !== "" && !regex_name.test(d.first_name)) {
      Alert.alert("Special characters are not allowed in first name.");
      this.setState({ first_name: this.state.userdata.user.first_name })
    } else if (d.last_name.trim() !== "" && !regex_name.test(d.last_name)) {
      Alert.alert("Special characters are not allowed in last name.");
      this.setState({ last_name: this.state.userdata.user.last_name })
    } else if(d.mobile.trim() !== "" && (d.mobile.trim().length !== 10 || !regex_phone.test(d.mobile) || noinitialarr.includes(parseInt(pnumber[0])))){
      Alert.alert("Invalid mobile number.");
    } else {
      this.setState({ loading: true });
      this.props.stores.user
        .updateUser(d)
        .then(res => {
          if (res.status == "success") {
            gAnalytics.trackEvent('Profile', 'User Profile Edit', {
              name: this.state.first_name + " " + this.state.last_name,
              email: this.state.userdata.user.email
            });
            /*Update data instantly*/
            this.setUserData(d.token);
            if (Platform.OS === "android") {
              ToastAndroid.show(res.message, ToastAndroid.SHORT);
            } else {
              Alert.alert(res.message);
            }
            // this.props.navigation.navigate("UserProfileScreen");
            this.setState({ editModal: false, submitText: "UPDATE" });
          } else {
            if (Platform.OS === "android") {
              ToastAndroid.show(res.message, ToastAndroid.SHORT);
            } else {
              Alert.alert(res.message);
            }
            this.setState({ submitText: "UPDATE" });
          }
        })
        .catch(err => console.log(err));
    }
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  logout() {

    Alert.alert(
      "Are you sure ?",
      null,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => {
            if (this.state.utype_social_val == 'google'){
              GoogleSignin.signOut().then(() => {console.log('out');}).catch((err) => {});
            } else if (this.state.utype_social_val == 'facebook'){
                LoginManager.logOut();
            }
            let keys = ['usertoken', 'usertype', 'userinfo','usertype_social'];
             AsyncStorage.multiRemove(keys)
              .then(() => {
                  gAnalytics.trackEvent('Profile', 'User Profile Logout',
                    {
                      name: this.state.first_name + " " + this.state.last_name,
                      email: this.state.userdata.user.email
                    });
                  let stat = false;
                  this.props.stores.user.updateUserPresence(stat);
                  branch.logout()
                  this.props.navigation.goBack();
              }).catch(e => console.log(e)); 
          }
        }
      ],
      { cancelable: false }
    );


  }

  handleEditProfile(visible) {
    // this.props.navigation.navigate("EditUserProfile",{token : this.state.token})
    this.setState({ editModal: visible });
  }

  _onRefresh() {
    this.setUserData(this.state.token)
  }

  handleImageUpload = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          selectedImage: true,
          form_profile_pic: response.uri
        })
      }
    });
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


  render() {
    const { userdata } = this.state;
    const { navigate } = this.props.navigation;

    if (this.state.loading) {
      return <SpinkitLarge />;
    } else {
      return (
       <View style={Style.container}> 
          <ScrollView 
            style={{ height: '100%' }} 
            onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
            onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}>
          {this.state.userdata_ispresent ? (
            <ScrollView style={[Style.container]}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                />
              }>
              {/*-------------------------------------Modal for editing profile--------------------------------------*/}
              <Modal
                animationType={"fade"}
                transparent={false}
                visible={this.state.editModal}
                onRequestClose={() => {
                  console.log("Modal has been closed.");
                }}>
                {/*Close Modal*/}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: Platform.OS === "ios" ? 35 : 15,
                    paddingBottom: 15
                  }}>
                  <TouchableHighlight
                    style={{ width: 50, alignItems: "center" }}
                    onPress={() => {
                      this.handleEditProfile(!this.state.editModal);
                    }}>
                    <Icon
                      style={[
                        Style.back_btn,
                        {
                          color: "#000",
                          position: "relative",
                          marginTop: 0,
                          left: 0,
                          alignSelf: "center"
                        }
                      ]}
                      name="chevron-left"
                    />
                  </TouchableHighlight>
                  <View style={{ width: 150 }}>
                    <Text
                      style={[
                        Style.designer_profile_title,
                        { alignSelf: "center" }
                      ]}>
                      Update profile{" "}
                    </Text>
                  </View>
                  <View style={{ width: 50 }} />
                </View>

                {/*Edit profile form........*/}
                <ScrollView style={[Style.container,{marginBottom:25}]}>
                  {/*Image upload*/}
                 
                  <Avatar
                    xlarge
                    rounded
                    source={{
                      uri: this.state.selectedImage ?
                        this.state.form_profile_pic : (this.state.profile_pic ? Config.BaseUrl + this.state.profile_pic : Config.NoImageUrl)
                    }}
                    onPress={this.handleImageUpload}
                    containerStyle={{ "alignSelf": 'center', marginTop: 10 }}
                    activeOpacity={0.9} />
                  {/*User profile dyanamic*/}
                  <View style={Style.designer_profile_container}>
                    <View style={css.textInputWrap}>
                      <Text style={Style.designer_profile_title}>
                        First Name
                      </Text>
                      <TextInput
                        placeholder="First Name"
                        underlineColorAndroid="transparent"
                        style={css.textInput}
                        value={this.state.first_name}
                        maxLength={100}
                        returnKeyType={"done"}
                        onChangeText={text => this.setState({ first_name: text })} />
                    </View>

                    <View style={css.textInputWrap}>
                      <Text style={Style.designer_profile_title}>
                        Last Name
                      </Text>
                      <TextInput
                        placeholder="Last Name"
                        underlineColorAndroid="transparent"
                        maxLength={100}
                        style={css.textInput}
                        returnKeyType={"done"}
                        value={this.state.last_name}
                        onChangeText={text => this.setState({ last_name: text })} />
                    </View>

                    <View style={css.textInputWrap}>
                      <Text style={Style.designer_profile_title}>Email</Text>
                      <TextInput
                        placeholder="Email"
                        underlineColorAndroid="transparent"
                        editable={false}
                        selectTextOnFocus={false}
                        style={css.textInput}
                        value={this.state.email}
                        onChangeText={text => this.setState({ email: text })}
                      />
                    </View>

                    <View style={css.textInputWrap}>
                      <Text style={css.textLabel}>Address 1</Text>
                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholder="Enter your address"
                        style={css.textInput}
                        value={this.state.address1 !== 'null' && this.state.address1 !== 'undefined' ? this.state.address1 : ''}
                        onChangeText={text => this.setState({ address1: text })} />
                    </View>

                    <View style={css.textInputWrap}>
                      <Text style={css.textLabel}>Address 2</Text>
                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholder="Enter your address (Optional)"
                        style={css.textInput}
                        value={(this.state.address2 !== 'null' && this.state.address2 !== 'undefined') ? this.state.address2 : ''}
                        onChangeText={text => this.setState({ address2: text })}
                      />
                    </View>

                    <View style={[css.textInputWrap]}>
                      <Text style={Style.designer_profile_title}>
                        Select Country
                      </Text>

                      <Picker
                        itemStyle={{ height: 88 }}
                        pickerStyleType={{ height: 50 }}
                        selectedValue={this.state.country}
                        onValueChange={this.upDateCountry}>
                        <Picker.Item label="Select Country" value="" />
                        {this.state.countrydata.map(item => {
                          return (
                            <Picker.Item
                              key={item.id}
                              label={item.country_name}
                              value={item.id}
                            />
                          );
                        })}
                      </Picker>
                    </View>

                    <View style={css.textInputWrap}>
                      <Text style={Style.designer_profile_title}>
                        Select State
                      </Text>
                      <Picker
                        itemStyle={{ height: 88 }}
                        pickerStyleType={{ height: 50 }}
                        selectedValue={this.state.state}
                        onValueChange={this.upDateState}>
                        <Picker.Item label="Select State" value="" />
                        {this.state.statedata.map(item => {
                          return (
                            <Picker.Item
                              key={item.id}
                              label={item.state_name}
                              value={item.id}
                            />
                          );
                        })}
                      </Picker>
                    </View>

                    <View style={css.textInputWrap}>
                      <Text style={Style.designer_profile_title}>
                        Select City
                      </Text>
                      <Picker
                        itemStyle={{ height: 88 }}
                        pickerStyleType={{ height: 50 }}
                        selectedValue={this.state.city}
                        onValueChange={this.upDateCity}>
                        <Picker.Item label="Select City" value="" />
                        {this.state.citydata.map(item => {
                          return (
                            <Picker.Item
                              key={item.id}
                              label={item.city_name}
                              value={item.id}
                            />
                          );
                        })}
                      </Picker>
                    </View>

                    <View style={css.textInputWrap}>
                      <Text style={Style.designer_profile_title}>Zipcode</Text>
                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholder="Zipcode"
                        keyboardType="phone-pad"
                        style={css.textInput}
                        value={this.state.zipcode !== '0' ? this.state.zipcode : ''}
                        returnKeyType={"done"}
                        onChangeText={text => this.setState({ zipcode: text })}
                      />
                    </View>

                    <View style={css.textInputWrap}>
                      <Text style={Style.designer_profile_title}>Mobile</Text>
                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholder="Mobile (e.g 8458789548)"
                        style={css.textInput}
                        keyboardType="phone-pad"
                        value={(this.state.mobile !== 'undefined' && this.state.mobile !== 'null') ? this.state.mobile : ''}
                        returnKeyType={"done"}
                        onChangeText={text => this.setState({ mobile: text })} />
                    </View>

                    <View style={css.textInputWrap}>
                      <Text style={Style.designer_profile_title}>
                        Telephone
                      </Text>
                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholder="Telephone"
                        style={css.textInput}
                        keyboardType="phone-pad"
                        value={(this.state.telephone_no !== 'null' && this.state.telephone_no !== 'undefined') ? this.state.telephone_no : ''}
                        returnKeyType={"done"}
                        onChangeText={text => this.setState({ telephone_no: text })} />
                    </View>

                    <View style={css.textInputWrap}>
                      <Text style={Style.designer_profile_title}>
                        Company
                      </Text>
                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholder="Company Name (Optional)"
                        style={css.textInput}
                        value={(this.state.company_name !== 'null' && this.state.company_name !== 'undefined') ? this.state.company_name : ''}
                        returnKeyType={"done"}
                        onChangeText={text => this.setState({ company_name: text })} />
                    </View>

                    {/*subscribe to newsletter*/}
                    <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
                      <View
                        style={{
                          width: APP_WIDTH - 100,
                          height: 50,
                          alignSelf: "flex-start"
                        }}>
                        <Text style={(css.textLabel, { fontSize: 13 })}>
                          Subscribe to newsletter
                          </Text>
                      </View>
                      <View style={{ width: 60, height: 50, marginLeft: 10 }}>
                        <Switch
                          onValueChange={value =>
                            this.setState({ is_newsletter_subscribed: value })}
                          style={{ marginBottom: 10, marginTop: -10 }}
                          value={this.state.is_newsletter_subscribed == 0 ? false : true}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={css.wrapButton}>
                    <TouchableOpacity style={Style.btnLogIn} onPress={this.update.bind(this)} >
                      <Text style={Style.btnLogInText}>
                        {" "}{this.state.submitText}{" "}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
                {/*Edit profile form end........*/}
				
				
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
				
				
              </Modal>

              {/*-------------------------------------Modal for editing profile end--------------------------------------*/}

              {/*--------------------User Profile Component----------------------*/}
              <UserProfileInfoScreen
                userdata={userdata}
                profile_pic={this.state.profile_pic}
              />
              <View style={css.wrapButton}>
                <TouchableOpacity
                    style={[Style.btnLogIn, {
                      width: APP_WIDTH - 20, marginBottom: 2, paddingTop : 10,paddingBottom : 10 }]}
                  onPress={() => {
                    this.handleEditProfile(true);
                  }}>
                  <Text style={Style.btnLogInText}> {'Edit Profile'} </Text>
                </TouchableOpacity>
              </View>

              <View style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between"
              }}>
                {!this.state.usertype_social ? (
                  <TouchableOpacity
                      style={[ostyles.btn_2, { paddingTop: 10, paddingBottom: 10}]}
                    onPress={() =>
                      this.props.navigation.navigate("ChangePasswordNormal", {
                        token: this.state.token
                      })}>
                    <Text style={Style.btnLogInText}> {'Change Password'} </Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  style={[
                    ostyles.btn_2,
                      { width: this.state.usertype_social ? "95%" : "45%", paddingTop: 10, paddingBottom: 10 }
                  ]}
                  onPress={this.logout}>
                  <Text style={Style.btnLogInText}> {'Logout'} </Text>
                </TouchableOpacity>
              </View>

              {/*--------------------User Profile Component End----------------------*/}
             
            </ScrollView>
                     
          ) : (
              <SignInScreen
                handleSignIn={this.handleSignIn}
                navHandle={this.navHandle}
                hideSkip={this.state.hideSkip}
              />
            )}
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
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#ede3f2",
    padding: 100,
    paddingTop: 20
  },
  modal: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f7021a",
    padding: 100
  },
  text: {
    color: "#3f2949",
    marginTop: 10
  }
});
/*           {
            !this.state.hideHome && this.state.userdata_ispresent ?
              <View style={[Style.fixedFooter, { width: 50, height: 50, borderRadius: 100, right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }]}>
                <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}>
                  <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
                </TouchableOpacity>
              </View> : null
          } */