// Listing of stores/partners......
import React from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  ListView,
  Image,
  ActivityIndicator,
  FlatList,
  AsyncStorage,
  BackHandler,
  Alert,
  Platform,
  PermissionsAndroid
} from "react-native";
import styles from "../../../styles";
import Icon from "react-native-vector-icons/FontAwesome";
import { Images, Config, gAnalytics, Style } from "@common";
import { inject, observer } from "mobx-react";
import { Spinkit, SpinkitLarge, TabBarIcon } from "@components";
import Color from "@common/Color";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
/*For ios*/
import Permissions from 'react-native-permissions'

const baseUrl = Config.BaseUrl;

@inject("stores")
@observer
export default class NearMeScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dataSource: "",
      animating: true,
      isFetching: false,
      partnerdata: [],
      param: 0,
      page: 1,
      smallspin: true,
      lat: null,
      long: null,
      storeid: 0,
      notfound: false,
      hideHome : false,
    };

    gAnalytics.trackScreenView("NearMePage");

    // this.handleLocationService()
  }

  static navigationOptions = ({ navigation }) => ({
    title: "Nearby",
    tabBarLabel: "Nearby"
  });

  componentWillMount() {
    let storeid = this.props.navigation.state.params.storeid;
    this.setState({ storeid }, () => {
      this.handleAnalytics();
    }); // This store should be excluded

    let { camefrom } = this.props.navigation.state.params;
    if (camefrom == "store") {
      let { latitude, longitude } = this.props.navigation.state.params;
      this.setState({ lat: latitude, long: longitude }, () => {
          this.fetchNear(this.state.lat, this.state.long, this.state.page);
      });
    } else {
      const { stores } = this.props;
      this.props.stores.location
        .checkCurrentLocation()
        .then(res => {
          if (res) {
            res = JSON.parse(res);
            this.setState({ lat: res.latitude, long: res.longitude }, () => {
                this.fetchNear(
                  this.state.lat,
                  this.state.long,
                  this.state.page
                );
            });
          } else {
            this.handleLocationService();
          }
        })
        .catch(err => console.log(err));
    }
  }

  handleAnalytics() {
    AsyncStorage.getItem("usertoken")
      .then(item => {
        if (item) {
          this.props.stores.user
            .getuserInfoBasic()
            .then(data => {
              let d = JSON.parse(data);
              gAnalytics.setUser(d.id.toString());
            })
            .catch(err => console.log(err));
        }
        gAnalytics.trackEvent("nearme", "view", { name: "NearMePage" });
      })
      .catch(e => console.log(e));
  }

  getLocation() {
    if (Platform.OS == "android") {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
        .then(granted => {
          if (granted == "denied") {
            if (this.state.lat && this.state.long)
            this.fetchNear(this.state.lat, this.state.long, 1)
            else
            this.props.navigation.goBack()
          } else {
            this.setState({ animating: true }, () => {
              this.handleLocationThenNearMe()
            });
          }
        })
        .catch(e => console.log(e));
    } else {
      Permissions.check('location', { type: 'whenInUse' }).then(response => {
        if (response !== 'authorized') {
          Permissions.request('location', { type: 'whenInUse' }).then(response => {
            // this.setState({ locationPermission: response })
            if (response == 'denied') {
              Alert.alert('Location Disabled',
                'Location services need to be turned on',
                [{ text: 'Cancel', onPress: () => this.props.navigation.goBack(), style: 'cancel' },
                {
                  text: 'Open Settings',
                  onPress: () => {
                    Permissions.openSettings().then(res => {
                      if(res)
                        this.handleLocationThenNearMe()
                      else
                        this.props.navigation.goBack()   
                      /*this.setState({ animating: true }, () => {
                            this.handleLocationThenNearMe()
                        });*/
                    }).catch(e => console.log(e))
                  }
                }],
                { cancelable: false })
            } else {
              this.setState({ animating: true }, () => {
                this.handleLocationThenNearMe()
              });
            }
          }).catch(err => console.log("Permissions Error", err))
        } else {
          this.setState({ animating: true }, () => {
            this.handleLocationThenNearMe()
          });
        }
      }).catch(e => console.log(e))
    }
  }

  handleLocationThenNearMe() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.props.stores.location
          .getLocationData(
            position.coords.latitude,
            position.coords.longitude
          )
          .then(res => {
            this.setState(
              {
                lat: position.coords.latitude,
                long: position.coords.longitude
              },
              () => {
                AsyncStorage.setItem("locationdata", res)
                  .then(s => { })
                  .catch(e => console.log(e));
                this.fetchNear(this.state.lat, this.state.long, 1);
              }
            );
          })
          .catch(e => console.log("Error in location", e));
      },
      error => {
        console.log(error);
      }
    );
  }

  handleLocationService() {
    if (Platform.OS == 'android') {
      this.handleLocationAsync().then(res => {
          if(res){
            this.getLocation();
          }else{
            this.props.navigation.goBack()
          }
      }).catch(e => {
        console.log(e)
        this.props.navigation.goBack()
      })
      // LocationServicesDialogBox.checkLocationServicesIsEnabled({
      //   message:
      //     "<h3>Location service disabled</h3>Allow Zingbi to change your device settings<br/>",
      //   ok: "YES",
      //   cancel: "NO",
      //   enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => ONLY GPS PROVIDER
      //   showDialog: true, // false => Opens the Location access page directly
      //   openLocationServices: true // false => Directly catch method is called if location services are turned off
      // })
      //   .then(success => {
      //     LocationServicesDialogBox.forceCloseDialog();
      //     this.getLocation();
      //   })
      //   .catch(error => {
      //     this.props.navigation.goBack()
      //   });
    } else {
      this.getLocation();
    }
  }


  async handleLocationAsync(){
    let check = await LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message: "Allow Zingbi to change your device settings",
      ok: "YES",
      cancel: "NO",
      enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
      showDialog: true, // false => Opens the Location access page directly
      openLocationServices: true, // false => Directly catch method is called if location services are turned off
      preventOutSideTouch: false, //true => To prevent the location services window from closing when it is clicked outside
      preventBackClick: false //true => To prevent the location services popup from closing when it is clicked back button
    }).catch(error => error);

    return Object.is(check.status, "enabled");
  }

  fetchNear(lat, long, page) {
    const { stores } = this.props;
    stores.partner
      .fetchNearByMe(lat, long, this.state.page, this.state.storeid)
      .then(res => {
        if (page == 1 && res.length == 0) {
          this.setState({ smallspin: false, notfound: true, animating: false });
        } else if (res.length == 0) {
          this.setState({ smallspin: false, animating: false });
        } else {
          this.setState(state => ({
            partnerdata: [...state.partnerdata, ...res],
            animating: false,
          }));
          /*Filtering the store id*/
          this.setState({
            partnerdata: this.state.partnerdata.filter(
              item => item.id !== this.state.storeid
            )
          });
        }
      })
      .catch(err => console.log(err));
  }

  onRefresh() {
    let page = 1;
    const { stores } = this.props;

    this.setState({ page: 1, isFetching: true }, () => {
      stores.partner
        .fetchNearByMe(this.state.lat, this.state.long, page)
        .then(res => {
          if (res.length == 0) {
            this.setState({ smallspin: false, notfound: true });
          }
          this.setState(state => ({
            partnerdata: res,
            animating: false,
            isFetching: false,
            notfound: false
          }));
        })
        .catch(err => console.log(err));
    });
    // this.setState({ isFetching: false });
  }

  tConv24(time24) {
    var ts = time24;
    var H = +ts.substr(0, 2);
    var h = H % 12 || 12;
    h = h < 10 ? "0" + h : h; // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  }

  LoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.fetchNear(this.state.lat, this.state.long, this.state.page);
      }
    );
  };

  _renderFooter = () => {
    if (this.state.smallspin) {
      return <Spinkit />;
    } else {
      return null;
    }
  };

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.9}
        style={[
          styles.product_listing_content,
          {
            paddingTop: 0,
            borderRadius: 2,
            marginTop: 10,
            marginBottom: 5,
            borderColor: "rgba(193, 193, 193, 0.89)",
            borderWidth: 0.8
          }
        ]}
        onPress={() =>
          this.props.navigation.navigate("Product", { id: item.id })}>
        <View
          style={{
            padding: 0
          }}>
          <View style={styles.product_listing_content_top}>
            <View
              style={[
                styles.product_listing_content_title,
                {
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }]}>
              <Text
                style={[
                  styles.product_listing_content_title_txt,
                  { marginTop: 10 }
                ]}>
                {item.store_name}
              </Text>
            </View>
            <View
              style={[
                styles.product_listing_content_txt2,
                {
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexWrap: "wrap"
                }
              ]}>
              {/* <Text style={styles.product_listing_content_reviews}>
                {item.reviews} Blogs - {item.beenhere} Been here
              </Text> */}
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={[
                  styles.product_listing_content_location,
                  { textAlign: "left" }
                ]}>
                <Icon style={styles.iconCommon} name="map-marker" />{" "}
                {item.locality_name}
                {","}
                {item.city_name}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.product_listing_content_middle,
              { borderRadius: 0, overflow: "hidden" }
            ]}>
            <Image
              style={[
                styles.product_listing_content_img,
                { borderRadius: 0, overflow: "hidden" }
              ]}
              source={{
                uri: item.mobile_banner
                  ? baseUrl + item.mobile_banner
                  : Config.NoImageUrl
              }} />
          </View>

          {/*Check timings*/}
          <View style={styles.product_listing_content_bottom}>
            {item.open_status ? (
              <Text style={[styles.product_listing_content_bottom_time, {
                color: item.open_status == 'Open' ?
                  'green' : 'red'
              }]}>
                <Icon style={styles.iconCommon} name="clock-o" />{" "}
                {item.open_status}{" now"}
              </Text>
            ) : (
                <Text />
              )}

            {/*Price from and to hiding for now.....
            {item.price_from ? (
              <Text style={styles.product_listing_content_bottom_value}>
                <Icon style={styles.iconCommon} name="inr" /> {item.price_from}{" "}
                to {item.price_to}{" "}
              </Text>
            ) : (
                <Text />
              )} */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
    // Value from store i.e. this.partnerdata
    const d = this.state.partnerdata;
    if (this.state.animating) {
      return (<SpinkitLarge />)
    } else {
      if (this.state.notfound) {
        return (<View>
                  <View>
                    <Text style={{ textAlign: 'center', marginTop: 15, fontSize: 15 }} >{'Stores not found'}</Text>
                  </View>
                      <View style={[{ justifyContent: 'center' }]}>
                        <TouchableOpacity
                          style={{
                            width: '50%',
                            backgroundColor: '#808080',
                            borderRadius: 3,
                            padding: 8,
                            paddingLeft: 10,
                            marginTop: '3%',
                            marginLeft: '4%',
                            alignSelf: 'center'
                          }}
                          onPress={() => this.props.navigation.goBack()}>
                          <Text
                            style={[Style.product_description_title_center_bottom, {
                              color: '#fff',
                              marginBottom: 0,
                              textAlign: 'center'
                            }]}>
                            {" "}
                            <Icon
                              name="chevron-left"
                              size={20}
                              color="#fff"
                            />{"    "}
                            {'Go back'}
                          </Text>
                        </TouchableOpacity>
                      </View>
              </View>)
      } else {
        return (
          <View style={[styles.Container]}>
            <FlatList
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.isFetching}
              data={d}
              keyExtractor={item => item.id}
              renderItem={this._renderItem}
              removeClippedSubviews={false}
              ListFooterComponent={this._renderFooter}
              onEndReached={this.LoadMore}
              onEndThreshold={100}
              shouldItemUpdate={(props, nextProps) => {
                return props.item !== nextProps.item;
              }}
              onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
              onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}
            />

            {/* Footer */}
				{/*{
              !this.state.hideHome ?
                <View style={[Style.fixedFooter, { width: 50, height: 50, borderRadius: 100, right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }]}>
                  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}>
                    <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
                  </TouchableOpacity>
                </View> : null
				}*/}
				
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
  }
}