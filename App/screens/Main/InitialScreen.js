/* @flow */
import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  AsyncStorage,
  Modal,
  Alert,
  TouchableHighlight,
  BackHandler,
  Platform,
  Linking,
  PermissionsAndroid,
  AppState,
  ScrollView
} from "react-native";
import styles from "../../../styles";
import { SpinkitLarge } from "@components";
import { inject, observer } from "mobx-react";
import { SearchBar, ListItem } from "react-native-elements";
import SignInScreen from "../SignIn";
import SplashScreen from "react-native-splash-screen";
import { NavigationActions } from "react-navigation";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { Config, gAnalytics } from "@common";
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import branch, { BranchEvent } from 'react-native-branch' // branch integrate
import Permissions from 'react-native-permissions'

@inject("stores")
@observer
export default class InitialScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      hideSkip: false,
      branchRedirect: false,
      branchRefId: null,
      branchRefName: null,
      appState: AppState.currentState,
      iosModalVisible : true,
      showModal : false,
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.navHandle = this.navHandle.bind(this);
    this.skipLogin = this.skipLogin.bind(this);
  }

  static navigationOptions = {
    headerMode: "none"
  };

  componentWillMount() {
    /*Onesignal*/
    OneSignal.setSubscription(true);
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('registered', this.onRegistered);
    OneSignal.addEventListener('ids', this.onIds);

    //  AsyncStorage.removeItem('locationdata')
    //           .then(s => console.log(s))
    //           .catch(e => console.log(e))
    //  Alert.alert("Change Location : " + this.props.navigation.state.params.changelocation)
    setTimeout(() => {
      this.props.stores.misc
        .getApiVersion()
        .then(res => {
          let url = Config.PlayStoreUrl;
          if (res.status == "update") {
            Alert.alert(
              "Update Message",
              "Update required",
              [
                {
                  text: "Cancel",
                  onPress: () => BackHandler.exitApp(),
                  style: "cancel"
                },
                {
                  text: "Update",
                  onPress: () => this.handleLink(url)
                }
              ],
              { cancelable: false }
            );
          } else {
            this.handlebranch()
          }
        })
        .catch(e => console.log(e));
    }, 100);
  }


  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('registered', this.onRegistered);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  componentDidMount() {
    SplashScreen.hide();
    // Branch + Onesignal Here....
  }

  /* One signal functions..... */
  onReceived(notification) {
    console.log("Notification received: ", notification);
  }
  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onRegistered(notifData) {
    console.log("Device had been registered for push notifications!", notifData);
  }

  onIds(device) {
  //  console.log('Device info: ', device);
    if (device.pushToken) {
      AsyncStorage.getItem('OneSignalData')
        .then(result => {
        if (!result) {
            AsyncStorage.setItem('OneSignalData', JSON.stringify(device)).then(s => { }).catch(e => console.log(e))
          }
        }).catch(e => console.log(e))
    }

  }
  /* One signal functions End..... */


  handlebranch = () => {
    // console.log("handle branch function")
    this.branchInitialized = false
    branch.subscribe(({ error, params }) => {
      // branch.getFirstReferringParams().then(res => console.log(res)).catch(e => console.log(e))
      this.branchInitialized = true
      if (error) {
        console.log('Error from Branch: ' + error)
      }
      if (params.id) {
        const resetAction = NavigationActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: 'default' }),
            NavigationActions.navigate({ routeName: params.navigation_type, params: { id: params.id } })
          ]
        });
        this.props.navigation.dispatch(resetAction)
      }
      if (params['+non_branch_link']) {
        const nonBranchUrl = params['+non_branch_link']
        return
      }

      if (!params['+clicked_branch_link'] && !params["+non_branch_link"]) {
        return
      }
    })
    /* In case branch not working the second time in app */
    if (!this.branchInitialized) {
        this.checkLocation()
    }
  }

  checkLocation = () => {
    if (Platform.OS == 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then(granted => {
        //  console.log("Request permission result : ",granted);
        if (granted == 'denied' || granted == 'never_ask_again'){
          this._checkUser()
        } else {
          this.getLocation()
        }
      }).catch(e => console.log(e))
    } else {
      /* IOS */
      Permissions.check('location', { type: 'whenInUse' }).then(response => {
        if (response !== 'authorized') {
          Permissions.request('location', { type: 'whenInUse' }).then(response => {
            // this.setState({ locationPermission: response })
            if (response == 'denied') {
              /* Alert.alert('Location Disabled',
                'Location services need to be turned on',
                [{ text: 'Cancel', onPress: () => this._checkUser(), style: 'cancel' },
                {
                  text: 'Settings',
                  onPress: () => {
                    Permissions.openSettings().then(res => {
                      if(res)
                      this.getLocation()
                      else
                      this._checkUser()
                    }).catch(e => console.log(e))
                  }
                }],
                { cancelable: false }) */
              this.setState({
                loading: false,
                showModal: true,
                iosModalVisible: true
              })
            } else {
              this.getLocation()
            }
          }).catch(err => console.log("Permissions Error", err))
        } else {
          this.getLocation()
        }
      }).catch(e => console.log(e))
    }
  }

  handleLink(u) {
    Linking.canOpenURL(u)
      .then(supported => {
        if (!supported) {
          console.error("Can't handle url: " + u);
        } else {
          Linking.openURL(u)
            .then(data => {
              BackHandler.exitApp()
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => console.error("An error occurred", err));
  }

  _checkUser(){
    AsyncStorage.getItem("usertoken")
      .then(item => {
        if (item) {
          this.props.stores.user
            .getUserdetails(item)
            .then(success => {
              if(success.error){
                  // Remove token
                AsyncStorage.removeItem("usertoken")
                  .then(() => {
                    this.setState({ loading: false });
                   })
                  .catch(e => console.log(e));
              }else{
                this._handleuserinfo(item)
              }
            }).catch(e => console.log(e))
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(err => console.log(err));
  }

  _handleuserinfo(token) {
    AsyncStorage.getItem('userinfo')
      .then(result => {
        if (!result) {
          this.props.stores.user.setuserInfo(token)
            .then(res => {
              if (res) {
                this.props.navigation.navigate('Main')
              }
            }).catch(err => console.log(err))
        } else {
          let ud = JSON.parse(result);
          // console.log(ud.email + "");
          branch.setIdentity(ud.email + "")
          this.props.navigation.navigate('Main')
        }
      }).catch(e => console.log(e))
  }

  getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.props.stores.location
          .getLocationData(position.coords.latitude, position.coords.longitude)
          .then(res => {
            this.setState({ locationdata: res }, () => {
              AsyncStorage.setItem("locationdata", res).then(s => {
                this.props.stores.location.checkCurrentLocation().then(r => { }).catch(e => console.log(e))
                // console.log("success in location data set....now checking the user>>>>>>")
                this._checkUser()
              }).catch(e => console.log(e))
            });
          })
          .catch(e => {
            this._checkUser()
          });
      },
      error => {
        // Alert.alert("Check if your location settings are enabled.");
        if (error.code){
          this._checkUser()
        }
      }
    );
  };

  handleSignIn() {
    AsyncStorage.removeItem("expireGuestLoginTimeInit")
      .then(res => { })
      .catch(e => console.log(e));
    this.props.navigation.navigate("default");
  }

  navHandle(screen) {
    this.props.navigation.navigate(screen);
  }

  skipLogin() {
    this.props.navigation.navigate("default");
  }

  render() {
    if (this.state.loading) {
      return (<SpinkitLarge />);
    } else if(this.state.showModal){
        return(
          <ScrollView style={{ height:'100%',backgroundColor:'#d0d0d0' }} >
            <Modal
              animationType={"slide"}
              transparent={true}
              visible={this.state.iosModalVisible}
              onRequestClose={() => {
                console.log("Modal has been closed.");
              }}>
              <View style={{ height: '45%', width: '70%', backgroundColor: '#fff', alignSelf: 'center', top: '25%', elevate: 10 }} >
                <View style={{ marginLeft: 18 }} >

                  <Text style={{ marginTop: 15, fontSize: 16, fontWeight: '500' }} >
                    Location services are disabled
							</Text>
                  <Text style={{ fontSize: 13, marginTop: 10 }} >
                    {'Turn on Location Services for your iPhone'}
                  </Text>
                  {/* Instructions view */}


                  <Text style={{ marginTop: 10 }} >
                    {'1. Open the Settings app'}
                  </Text>
                  <Text style={{ marginTop: 10 }} >
                    {'2. Select Privacy'}
                  </Text>
                  <Text style={{ marginTop: 10 }} >
                    {'3. Select Location Services'}
                  </Text>
                  <Text style={{ marginTop: 10 }} >
                    {'4. Turn on Location Services'}
                  </Text>
                </View>

                <TouchableOpacity style={{ right: '6%', bottom: '4%', position: 'absolute', padding: 8 }}
                  onPress={() => {
                      this.setState({ 
                           showModal:false,
                           iosModalVisible: false ,
                           loading : true }, () => {
                        this._checkUser()
                      })
                    }}>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: '#d43' }} >{'OK'}</Text>
                </TouchableOpacity>

              </View>
            </Modal>
          </ScrollView>
        )
    } else {
      return (
        <SignInScreen
          handleSignIn={this.handleSignIn}
          navHandle={this.navHandle}
          skipLogin={this.skipLogin}
          hideSkip={this.state.hideSkip}
        />
      );
    }
  }
}

/*Version Check,Check user,handle location(Detect if location enabled),Push notification,Branch Deep linking,*/