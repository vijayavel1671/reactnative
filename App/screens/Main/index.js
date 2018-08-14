/* @flow */
import React, { Component } from "react";
import {
  View,Text,
  Button,TouchableOpacity,
  Dimensions,StyleSheet,
  ScrollView,Image,
  AsyncStorage,Easing,
  RefreshControl,BackHandler,
  FlatList,Modal,
  Alert,TouchableHighlight,
  Platform,Linking
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import NavigationBar from "react-native-navbar";
import styles from "../../../styles";
import { TabBarIcon, LeftHeader, SpinkitLarge , Menu } from "@components";
import { Images, Config, Style,gAnalytics } from "@common";
import { inject, observer, observable, action } from "mobx-react";
import { SearchBar, ListItem } from "react-native-elements";
import Drawer from "react-native-drawer-menu";
import SignInScreen from "../SignIn";
import HomeEvents from "../../Components/HomeEvents/HomeEvents";
import HomeNews from "../../Components/HomeNews/HomeNews";
import DesignerAdBanner from "../../Components/DesignerAdBanner/DesignerAdBanner";
import DesignerAd from "../../Components/DesignerAd/DesignerAd";


const APP_WIDTH = Dimensions.get("window").width;
const baseUrl = Config.BaseUrl;

@inject("stores")
@observer
export default class MainScreen extends Component {
  // stores.location.locationname = location.sublocality_level_2;
  constructor(props, context) {
    super(props, context);

    this.state = {
      location: this.props.stores.location.locationname,
      refreshing: false,
      closedDrawer: true,
      token: null,
      alerted: false,
      checkedModal: true,
      editModal: false,
      loading: true    
    };
    gAnalytics.trackScreenView('Home');
    gAnalytics.trackEvent('home', 'view' , {name : 'HomePage'});

    this.handleNavigationMain = this.handleNavigationMain.bind(this);
    this.handleAlertParent = this.handleAlertParent.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    const { params = {} } = navigation.state;
    return {
      headerStyle: { backgroundColor: '#fff' },
      headerTitle: (
        <Image
          style={styles.stack_navigate_logo}
          resizeMode="contain"
          source={require("../../assets/Images/zingbi-gold-logo.png")}
        />),
      headerLeft: (
        <TouchableOpacity
          style={{ marginLeft: 7, marginRight: 10 }}
          activeOpacity={0.9}
          onPress={() => {
            navigate("SelectLocationInApp");
          }}>
          <LeftHeader/>
        </TouchableOpacity>),
      headerRight: (
        <View style={{ width: 120, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TouchableOpacity
          style={{width: 40, padding:10, paddingRight: 0, paddingLeft: 20, marginRight: 10, alignItems: 'flex-end' }}
          onPress={() => navigate('SearchGlobal')}>
          <Icon
            name="search"
            style={{
              color: "#E29A0D",
              marginRight: 0,
              fontSize: 20
            }}/>
        </TouchableOpacity>
            <TouchableOpacity
              style={{ width: 40, padding:10, alignItems: 'center' }}
              onPress={() => params.handleDrawer()}>
              <Icon
                name="bars"
                style={{
                  color: "#E29A0D",
                  fontSize: 20
                }}/>
            </TouchableOpacity>

        </View>
      ),
      tabBarIcon: ({ tintColor }) => (
        <TabBarIcon icon={Images.icons.news} tintColor={tintColor} />
      ),

      tabBarLabel: <Icon style={styles.tab_icon} name={"home"} />
    };
  };

  DrawerOpen = () => {
   if(!this.state.loading){
     if (this.state.closedDrawer) {
       this.setState({ closedDrawer: false } , () => {
         this.drawer.openDrawer();
        });
      } else {
        this.setState({ closedDrawer: true } , () => {
          this.drawer.closeDrawer();
        });
      }
    } 
  };

  /* test(val){
    Alert.alert(val);
  } */
  componentDidMount() {
    this.props.navigation.setParams({ handleDrawer: this.DrawerOpen });
}

  componentWillMount() {
    this.handleHome()
  }

  handleHome(){
    setTimeout(() => {  
    this.props.stores.home
        .getHomeData()
        .then(res => {
          if (res) {
            this.setState({ loading: false } , () => {
                AsyncStorage.getItem("usertoken")
                  .then(token => {
                    if (token) {
                      this.props.stores.user.getuserInfoBasic()
                        .then(data => {
                          let d = JSON.parse(data)
                          let uid = d.id
                          gAnalytics.setUser(uid.toString())
                        }).catch(e => console.log(e))

                      this.setState({ token });
                    }
                  })
                  .catch(err => console.log(err));
               });
            }
        })
        .catch(e => console.log(e));
      },500)
}

  handleRateUs(){
    this.setState({ closedDrawer: true });
    this.drawer.closeDrawer();
    let url = Platform.OS === "android" ? Config.PlayStoreUrl : Config.AppStoreUrl
    Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    console.error("Can't handle url: " + url);
                } else {
                   Linking.openURL(url)
                      .then(data =>{
                          gAnalytics.trackEvent('rateus','open');
                      })
                      .catch(err => {
                          throw err;
                      })
                }
            })
            .catch(err => console.error("An error occurred", err));
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.props.stores.home.getHomeData().then(r =>{this.setState({ refreshing: false })}).catch(e => console.log(e));
  }

  /*------------------------Renders / Handles drawer menu items------------------------*/

  handleNavigationMain(url, params) {
    if(url == 'rateus'){
        this.handleRateUs()
    }else{
      this.setState({ closedDrawer: true });
      this.drawer.closeDrawer();
      this.props.navigation.navigate(url, params);
    }
  }


  handleAlertParent(title){
    this.setState({ closedDrawer: true });
    this.drawer.closeDrawer();
    Alert.alert(title,
      'You must be logged in to perform this action',
      [
        { text: 'Cancel', onPress: () => console.log('cancel'), style: 'cancel' },
        {
          text: 'LOG IN',
          onPress: () => this.props.navigation.navigate('UserProfileScreen')
        },],
      { cancelable: false })
  }
  /*------------------------Renders drawer menu items end------------------------*/

  render() {
    if (this.state.loading) {
      return <SpinkitLarge />;
    } else {
      var drawerContent = (
        <Menu handleNavigationMain={this.handleNavigationMain} handleAlertParent={this.handleAlertParent} />
      );
      // customize drawer's style (Optional)
      var customStyles = {
        drawer: {
          shadowColor: "#000",
          shadowOpacity: 0.4,
          shadowRadius: 10,
          zIndex: 1000
        },
        mask: {}, // style of mask if it is enabled
        main: {} // style of main board
      };

      //console.log(this.props.navigation.state.routeName);
      let hct = this.props.stores.home.homedata;
      let home_events = this.props.stores.home.homeEvents;
      let home_news = this.props.stores.home.homeNews;
      let hsecdata = this.props.stores.home.homeSectiondata;
      let designerAd_BigBanner = this.props.stores.home.designerAdBigBanner;
      let designer_Ad = this.props.stores.home.designerAd;


      const { navigate } = this.props.navigation;
      const starImg = 'star.png';
      return (
        <Drawer
          style={styles.container}
          ref={ref => (this.drawer = ref)}
          drawerWidth={270}
          drawerContent={drawerContent}
          type={Drawer.types.Overlay}
          customStyles={{ drawer: styles.drawer }}
          drawerPosition={Drawer.positions.Right}
          onDrawerOpen={() => {}}
          onDrawerClose={() => {}}
          easingFunc={Easing.ease}
          moveCapture={false}
          showMask={true}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />}>
            <View style={[styles.browseCategory_wrap]}>
              <Text style={{ textAlign: "center", top: -6, color: "#fff" }}>
                Browse Categories
              </Text>
              <ScrollView
                style={[styles.rowFlex, { marginTop: 10 }]}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {hct.map(item => {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.browseCategory_col}
                      onPress={() =>
                        navigate("Listing", { cid: item.id, name: item.name })}>
                      <Image
                        style={styles.browseCategory_img}
                        source={{
                          uri: item.thumbnail
                            ? baseUrl + item.thumbnail
                            : Config.NoImageUrl
                        }}/>
                      <Text style={styles.browseCategory_desc}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
            {/*Home sections......*/}
            <View>
              {hsecdata.map(section => {
                return (
                  <TouchableOpacity
                    key={section.id}
                    activeOpacity={0.7}
                    style={styles.home_banner_section}
                    onPress={() => navigate(section.screen)}>
                    <Image
                      style={[styles.home_banner_section_img]}  
                      source={{
                        uri: section.mobile_image
                          ? baseUrl + section.mobile_image
                          : Config.NoImageUrl
                      }}
                      />
                  </TouchableOpacity>
                );
              })}
            </View>
            {/*<TouchableOpacity
                    key={10}
                    activeOpacity={0.7}
                    style={styles.home_banner_section}
                    onPress={() => this.props.navigation.navigate('Event')}> 
                    <Image
                      style={[styles.home_banner_section_img]}  
                      source={{
                        uri: Config.NoImageUrl
                      }}
                      />
                    </TouchableOpacity>*/}
           <HomeEvents data={home_events} />
           <DesignerAdBanner data={designerAd_BigBanner} />
           <DesignerAd data={designer_Ad} />
           <HomeNews data={home_news}/>    
           <View style={{width: APP_WIDTH,  backgroundColor: '#E2E3E5',padding:20,height:APP_WIDTH/5}} >
              <Text style={{textAlign: 'center',fontSize:20,color:'#333333'}} >GET INVITED TO IN-STORE EVENTS</Text> 
          </View>
          </ScrollView>
         {/*  <View style={Style.fixedFooter}>
            <TouchableOpacity style={Style.iconFixFooter} onPress={() => console.log('Main')}>
              <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
            </TouchableOpacity>
            <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Designers')}>
              <TabBarIcon icon={Images.icons.user} tintColor={'#fff'} />
            </TouchableOpacity>
            <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Favorites')}>
              <TabBarIcon icon={Images.icons.star} tintColor={'#fff'} />
            </TouchableOpacity>
          </View> */}
          
        </Drawer>
      );
    }
  }
  
}
