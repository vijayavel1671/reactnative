/* @flow */

/* Screens */

import {Platform,StatusBar} from "react-native";
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
  DrawerNavigator
} from "react-navigation";
import { Languages, Style, Color, Images  } from "@common";
import { Spinkit, TabBarIcon } from "@components";
import React, { Component } from "react";
import { TabBar } from "@components";

import MainScreen from "../screens/Main";
import ListingScreen from "../screens/Listing";
import ProductScreen from "../screens/Product";
import SignUpScreen from "../screens/SignUp";
import SignInScreen from "../screens/SignIn";
import ForgotPasswordScreen from "../screens/ForgotPassword";
import SelectLocationInAppcreen from "../screens/Location/SelectLocationInApp";
import DesignerProfileScreen from "../screens/Designer/Profile";
import UserProfileScreen from "../screens/User/Profile";
import UserGalleryScreen from "../screens/User/UserGallery";
import StoreGalleryScreen from "../screens/Product/StoreGallery";
import ReportErrorScreen from "../screens/Forms/ReportError";
import FeedbackScreen from "../screens/Forms/Feedback";
import DesignerDirectoryScreen from "../screens/Designer/DesignerDirectory";
import BloggerDirectoryScreen from "../screens/Blogs/BloggerDirectory";
import BoutiquesScreen from "../screens/Product/StoreDirectory";
import NewArrivalsScreen from "../screens/Misc/NewArrivalsScreen";
import WhoWhatWearScreen from "../screens/Misc/WhoWhatWear"; //Who What Wear
import WWWDetailScreen from "../screens/Misc/WWWDetail";
import FavoritesScreen from "../screens/User/Favorites";
import ContactUsScreen from "../screens/Forms/ContactUs";
import BloggerProfileScreen from "../screens/Blogs/BloggerProfile";
import BlogScreen from "../screens/Blogs/BlogScreen";
import NewAppointmentScreen from "../screens/Forms/NewAppointment";
import ChangePasswordAfterForgotScreen from "../screens/User/ChangePassAfterForgot";
import StoreCollectionProductScreen from "../screens/Product/StoreCollectionProduct";
import InitialScreen from "../screens/Main/InitialScreen";
import ChangePasswordNormalScreen from "../screens/User/ChangePasswordNormal";
import AboutUsScreen from "../screens/Other/AboutUs";
import AskQustionScreen from "../screens/Product/AskQuestion";
import BlogItScreen from "../screens/Product/BlogIt";
import SettingsScreen from "../screens/Misc/Settings";
import StoreOffersEventsScreen from "../screens/Misc/OfferEvents";
import NearMeScreen from "../screens/Listing/NearMe";
import FeaturedScreen from "../screens/Misc/Featured";
import DesignerCollectionGalleryScreen from "../screens/Designer/DesignerCollectionGallery";
import OfferDetailScreen from "../screens/Misc/OfferDetail";
import TCScreen from "../screens/Misc/TermConditions";
import RecentlyViewedScreen from "../screens/User/RecentlyViewed";
import NotificationsScreen from "../screens/User/Notifications";
import MyChatsScreen from "../screens/User/MyChats";
import AppointmentsScreen from "../screens/User/Appointments";
import MyBlogsScreen from "../screens/User/MyBlogs";
import RateUsScreen from "../screens/Misc/RateUs";
import SearchGlobalScreen from "../screens/Misc/SearchGlobal";


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
        animationEnabled: true,
        tabBarOptions: {
          showLabel: true,
          activeTintColor: Color.tabbarTint,
          labelStyle: {
            fontSize: 10
          },
          indicatorStyle : { backgroundColor : '#041E42' },
          inactiveTintColor: Color.tabbarColor,
          style: {
            backgroundColor: "#fff"
          }
        },
        lazy: true
      }
    );

    const AppNavigator = StackNavigator(
      {
        Initial: {
          screen: InitialScreen,
          navigationOptions: {
            header: null
          }
        },
        default: {
          screen: TabNavigator(
            {
              Main: {
                screen: MainScreen,
                navigationOptions: {
                  headerMode: "screen",
                  title: "Zingbi Home"
                }
              },

              Directory: {
                screen: DirectoryScreen
              },

              Favorites : {
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
        },
        NewArrivals: { screen: NewArrivalsScreen },
        SignUp: { screen: SignUpScreen },
        SignIn: { screen: SignInScreen },
        Listing: { screen: ListingScreen },
        Feedback: { screen: FeedbackScreen },
        ContactUs: { screen: ContactUsScreen },
        AboutUs: { screen: AboutUsScreen },
        Product: {screen: ProductScreen,navigationOptions:{header: null}},
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
        StoreOffersEvents : { screen : StoreOffersEventsScreen },
        NearMe : { screen : NearMeScreen },
        FeaturedScreen : { screen : FeaturedScreen },
        DesignerCollectionGallery : { screen :DesignerCollectionGalleryScreen},
        OfferDetail : {screen : OfferDetailScreen},
        WhoWhatWearDetail : {screen : WWWDetailScreen},
        TermsAndConditions : { screen : TCScreen },
        RecentlyViewed : {screen : RecentlyViewedScreen},
        Notifications : { screen : NotificationsScreen },
        MyChats : { screen : MyChatsScreen },
        Appointments : { screen : AppointmentsScreen },
        RateUs : { screen : RateUsScreen },
        SearchGlobal : {screen : SearchGlobalScreen},
        MyBlogs : {screen : MyBlogsScreen}
        // login: {scree n: LogIn},
      },
      {
        mode: "card",
        initialRouteName : "Initial",
        initialRouteParams : {changelocation:false},
        navigationOptions: {
          headerMode: "screen",
          headerVisible: true,
          gesturesEnabled: false,
          lazy: false
        }
      }
    );

    /*--------------------------Navigation Screens End-----------------------------------------------------------------*/


export { AppNavigator };