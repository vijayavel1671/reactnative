/* @flow */

import {
  Platform,
  View,
  Image,
  Dimensions,
  StyleSheet,
  AsyncStorage,
  Text,
  BackHandler,
  Alert,
  NetInfo,
  Linking,
  StatusBar,
  ToastAndroid
} from "react-native";
import { Provider } from "mobx-react";
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
  DrawerNavigator
} from "react-navigation";
import { Languages, Style, Color, Images } from "@common";
import Icon from "react-native-vector-icons/FontAwesome";
import { Spinkit, TabBarIcon } from "@components";
import React, { Component } from "react";
import { inject, observer, observable } from "mobx-react";
import styles from "../styles";
import Stores from "./stores/stores";
import { TabBar } from "@components";
/*--------------------------------------Screens--------------------------------------------------------------*/
import MainScreen from "./screens/Main";
import ListingScreen from "./screens/Listing";
import ProductScreen from "./screens/Product";
import SignUpScreen from "./screens/SignUp";
import SignInScreen from "./screens/SignIn";
import ForgotPasswordScreen from "./screens/ForgotPassword";
import SelectLocationInAppcreen from "./screens/Location/SelectLocationInApp";
import DesignerProfileScreen from "./screens/Designer/Profile";
import UserProfileScreen from "./screens/User/Profile";
import UserGalleryScreen from "./screens/User/UserGallery";
import StoreGalleryScreen from "./screens/Product/StoreGallery";
import ReportErrorScreen from "./screens/Forms/ReportError";
import FeedbackScreen from "./screens/Forms/Feedback";
import DesignerDirectoryScreen from "./screens/Designer/DesignerDirectory";
import BloggerDirectoryScreen from "./screens/Blogs/BloggerDirectory";
import BoutiquesScreen from "./screens/Product/StoreDirectory";
import NewArrivalsScreen from "./screens/Misc/NewArrivalsScreen";
import WhoWhatWearScreen from "./screens/Misc/WhoWhatWear"; //Who What Wear
import WWWDetailScreen from "./screens/Misc/WWWDetail";
import FavoritesScreen from "./screens/User/Favorites";
import ContactUsScreen from "./screens/Forms/ContactUs";
import BloggerProfileScreen from "./screens/Blogs/BloggerProfile";
import BlogScreen from "./screens/Blogs/BlogScreen";
import NewAppointmentScreen from "./screens/Forms/NewAppointment";
import ChangePasswordAfterForgotScreen from "./screens/User/ChangePassAfterForgot";
import StoreCollectionProductScreen from "./screens/Product/StoreCollectionProduct";
import InitialScreen from "./screens/Main/InitialScreen";
import ChangePasswordNormalScreen from "./screens/User/ChangePasswordNormal";
import AboutUsScreen from "./screens/Other/AboutUs";
import AskQustionScreen from "./screens/Product/AskQuestion";
import BlogItScreen from "./screens/Product/BlogIt";
import SettingsScreen from "./screens/Misc/Settings";
import StoreOffersEventsScreen from "./screens/Misc/OfferEvents";
import NearMeScreen from "./screens/Listing/NearMe";
import FeaturedScreen from "./screens/Misc/Featured";
import DesignerCollectionGalleryScreen from "./screens/Designer/DesignerCollectionGallery";
import OfferDetailScreen from "./screens/Misc/OfferDetail";
import TCScreen from "./screens/Misc/TermConditions";
import RecentlyViewedScreen from "./screens/User/RecentlyViewed";
import NotificationsScreen from "./screens/User/Notifications";
import MyChatsScreen from "./screens/User/MyChats";
import AppointmentsScreen from "./screens/User/Appointments";
import UpdateAppointmentsScreen from "./screens/User/UpdateAppointment";
import MyBlogsScreen from "./screens/User/MyBlogs";
import RateUsScreen from "./screens/Misc/RateUs";
import SearchGlobalScreen from "./screens/Misc/SearchGlobal";

/*--------------------------------------Screens End--------------------------------------------------------------*/

const stores = new Stores();
@observer
export default class RootAppTest extends Component {
  constructor() {
    super();
    this.state = {
      isuserLoggedIn: true,
      lc: "Chennai",
      lat: null,
      long: null
    };

    console.disableYellowBox = true;
    console.error = (error) => error.apply;
  }


  componentWillMount() {
    /*----------------------Home data service-------------------*/
    stores.home.getHomeData();
    /*-------------------------------------------*/
    stores.location
      .checkCurrentLocation()
      .then(res => {
        if (res) {
          res = JSON.parse(res)
          this.setState({ lat: res.latitude, long: res.longitude })
        } else {
          console.log("nothing")
        }
      })
      .catch(err => console.log(err))
    /*to do..........*/
  }


  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
  }

  _handleConnectionChange = (isConnected) => {
    if (!isConnected) {
      if (Platform.OS === "android") {
        ToastAndroid.show("Please check your internet connection", ToastAndroid.SHORT);
      } else {
        Alert.alert("Please check your internet connection")
      }
     
    }
  };


  render() {
    const HomeStack = StackNavigator({
      Initial: {screen: InitialScreen,navigationOptions: {header: null}},
      Main: {screen: MainScreen},
      NewArrivals: { screen: NewArrivalsScreen },
      SignUp: { screen: SignUpScreen },
      SignIn: { screen: SignInScreen },
      Listing: { screen: ListingScreen },
      Feedback: { screen: FeedbackScreen },
      ContactUs: { screen: ContactUsScreen },
      AboutUs: { screen: AboutUsScreen },
      Product: { screen: ProductScreen, navigationOptions: { header: null } },
      ForgotPassword: { screen: ForgotPasswordScreen },
      SelectLocationInApp: { screen: SelectLocationInAppcreen },
      DesignerProfile: { screen: DesignerProfileScreen },
      UserGallery: { screen: UserGalleryScreen },
      ReportError: { screen: ReportErrorScreen },
      UserProfileScreen: { screen: UserProfileScreen },
      WhoWhatWearScreen: { screen: WhoWhatWearScreen },
      BloggerProfile: { screen: BloggerProfileScreen },
      Blog: { screen: BlogScreen },
      NewAppointment: { screen: NewAppointmentScreen },
      ChangePasswordAfterForgot: { screen: ChangePasswordAfterForgotScreen },
      StoreGallery: { screen: StoreGalleryScreen },
      StoreProductCollection: { screen: StoreCollectionProductScreen },
      ChangePasswordNormal: { screen: ChangePasswordNormalScreen },
      AskQuestion: { screen: AskQustionScreen },
      BlogIt: { screen: BlogItScreen },
      Settings: { screen: SettingsScreen },
      StoreOffersEvents: { screen: StoreOffersEventsScreen },
      NearMe: { screen: NearMeScreen },
      FeaturedScreen: { screen: FeaturedScreen },
      DesignerCollectionGallery: { screen: DesignerCollectionGalleryScreen },
      OfferDetail: { screen: OfferDetailScreen },
      WhoWhatWearDetail: { screen: WWWDetailScreen },
      TermsAndConditions: { screen: TCScreen },
      RecentlyViewed: { screen: RecentlyViewedScreen },
      Notifications: { screen: NotificationsScreen },
      MyChats: { screen: MyChatsScreen },
      Appointments: { screen: AppointmentsScreen },
      UpdateAppointment: { screen: UpdateAppointmentsScreen },
      RateUs: { screen: RateUsScreen },
      SearchGlobal: { screen: SearchGlobalScreen },
      MyBlogs: { screen: MyBlogsScreen }
    })

    /*--------------------------Navigation Screens-----------------------------------------------------------------*/
    const DirectoryScreen = TabNavigator(
      {
        Designers: {
          screen: DesignerDirectoryScreen,
          navigationOptions: {
            headerMode: "screen",
            gesturesEnabled: false,
            title: "Designers",
            tabBarLabel: "Designer"
          }
        },
        Bloggers: {
          screen: BloggerDirectoryScreen,
          navigationOptions: {
            headerMode: "screen",
            gesturesEnabled: false,
            title: "Bloggers",
            tabBarLabel: "Blogger"
          }
        },
        Boutiques: { screen: BoutiquesScreen }
      },
      {
        initialRouteName: "Designers",
        title: "Directory",
        tabBarPosition: "top",
        swipeEnabled: true,
        animationEnabled: false,
        tabBarOptions: {
          showLabel: true,
          activeTintColor: Color.tabbarTint,
          labelStyle: {
            fontSize: 10
          },
          indicatorStyle: { backgroundColor: '#041E42' },
          inactiveTintColor: Color.tabbarColor,
          style: {
            backgroundColor: "#fff"
          }
        },
        lazy: true
      }
    );

    const AppNavigator = TabNavigator(
      {
        Main: { screen: HomeStack, navigationOptions: { tabBarIcon: ({ tintColor }) => <TabBarIcon 
                      icon={Images.icons.news}
                      tintColor={tintColor} 
                      />}},
        Directory: { screen: DirectoryScreen },
        Favorites: {
          screen: FavoritesScreen,
          navigationOptions: {
            headerMode: "screen",
            title: "Favorites"
          }
        }
      },
      {
        initialRouteName: "Main",
        tabBarComponent: TabBar,
        tabBarPosition: "bottom",
        swipeEnabled: false,
        animationEnabled: true,
        gesturesEnabled: false,
        tabBarOptions: {
          showLabel: true,
          activeTintColor: '#E29A0D',
          inactiveTintColor: '#DDD',
          style: {
            backgroundColor: "#F48FB1"
          }
        },
        lazy: true
      }
    )

    /*--------------------------Navigation Screens End-----------------------------------------------------------------*/

    const Root = () => {
      return (
        <AppNavigator
          onNavigationStateChange={(prevState, currentState) => {
            /* Check for user token */

            // console.log("previous State");
            // console.log(prevState);
            console.log("current State");
            console.log(currentState.routes);
            /*For main screen*/
             if (currentState.routes[currentState.index].routeName == "Appointments") {
              AsyncStorage.getItem("usertoken")
                .then(item => {
                  if (item) {
                    stores.user.getMyAppointments(item).then(r => { }).catch(e => console.log(e));
                  }
                })
                .catch(err => console.log(err));

            } else if (currentState.routes[currentState.index].routeName == "UserProfileScreen") {
              // console.log("user profile")
              AsyncStorage.getItem("usertoken")
                .then(item => {
                  if (item) {
                    stores.user.getUserdetails(item)
                      .then(res => {
                        if (res.status == "success") {
                          stores.user.userdata = res;
                        }
                      })
                      .catch(err => console.log(err));
                    stores.partner.recentViewStores(item).then(r => { }).catch(e => console.log(e));;
                  } else {
                    stores.user.userdata = [];
                  }
                  // console.log(stores.user.userdata);
                })
                .catch(err => console.log(err));
            } else if (currentState.routes[currentState.index].index == 0) {
              // console.log("1")
              /*For Home screen*/
              AsyncStorage.getItem("usertoken")
                .then(item => {
                  let stat = null;
                  if (item) {
                    stat = true
                  } else {
                    stat = false
                  }
                  stores.user.updateUserPresence(stat)
                })
                .catch(err => console.log(err));
            } else if (currentState.routes[currentState.index].index == 1) {
              // console.log("2")
              /*For Directory screen*/
              //console.log("Directory screen")
            } else if (currentState.routes[currentState.index].index == 2) {
              // console.log("3")
              //('Favorites screen');
              AsyncStorage.getItem("usertoken")
                .then(item => {
                  if (item) {
                    let stat = true;
                    stores.user.updateUserPresence(stat)
                    stores.user.getMyBookmarks(item).then(r => { }).catch(e => console.log(e));
                  }
                })
                .catch(err => console.log(err));
              //stores.partner.fetchData()
            } else if (currentState.routes[currentState.index].routeName == "Initial" &&
              prevState.routes[prevState.index].routeName == "default") {
              BackHandler.exitApp();
              return true;
            } else if (currentState.routes[currentState.index].routeName == "SignUp" &&
              prevState.routes[prevState.index].routeName == "default") {
              BackHandler.exitApp();
              return true;
            } else if (currentState.routes[currentState.index].routeName == "Listing") {
              return null
            }
          }}
        />
      )
    }

    return (
      <Provider stores={stores}>
        <Root />
      </Provider>
    );
  }
}
