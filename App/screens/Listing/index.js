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
  Alert,
  StyleSheet,
  Platform
} from "react-native";
import styles from "../../../styles";
import Icon from "react-native-vector-icons/FontAwesome";
import { TabBarIcon } from "@components";
import { Images, Config, gAnalytics, Style } from "@common";
import { inject, observer } from "mobx-react";
import { Spinkit, SpinkitLarge } from "@components";
import Color from "@common/Color";
import { NavigationActions } from 'react-navigation';

const baseUrl = Config.BaseUrl;

@inject("stores")
@observer
class ListingScreen extends React.Component {
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
      hideHome: false
    };

    gAnalytics.trackScreenView('ListingPage');
    this.props.stores.partner.partnerdata = [];
  }

  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    const { params = {} } = navigation.state;
    return {
      title: params.name,
      tabBarLabel: "Listing",
      headerTintColor: '#000',
      headerStyle: { backgroundColor: '#fff' },
      headerRight: (
        <TouchableOpacity style={{ width: 50, }} onPress={() => navigate('NearMe', { storeid: 0, camefrom: 'listing' })}>
          <Icon
            name="street-view"
            style={{ color: "#000", marginRight: 0, marginLeft: 10, fontSize: 20 }}
          />
        </TouchableOpacity>
      ),
    }
  };

  componentWillMount() {
    let paramId = this.props.navigation.state.params.cid;
    this.setState({ param: paramId }, () => {
      this.handleAnalytics()
    });

    this.props.stores.location
      .checkCurrentLocation()
      .then(res => {
        if (res) {
          res = JSON.parse(res)
          this.setState({ lat: res.latitude, long: res.longitude })
        }
        this.fetchDataByCat(paramId, this.state.page)
      })
      .catch(err => console.log(err))

  }


  handleAnalytics() {
    AsyncStorage.getItem("usertoken")
      .then(item => {
        if (item) {
          this.props.stores.user.getuserInfoBasic()
            .then(data => {
              let d = JSON.parse(data)
              gAnalytics.setUser(d.id.toString());
            }).catch(err => console.log(err))
        }
        gAnalytics.trackEvent('listing', 'view',
          { name: 'ListingPage', categoryId: this.state.param, categoryName: this.props.navigation.state.params.name });
      }).catch(e => console.log(e))
  }

  onRefresh(pid) {
    const { stores } = this.props;
    let page = 1;
    this.setState({ isFetching: true, page: 1 }, () => {
      stores.partner.fetchData(pid, page, this.state.lat, this.state.long)
        .then(data => {
          this.setState(state => ({ partnerdata: data, animating: false, isFetching: false }));
        })
        .catch(err => console.log(err));
    });

  }

  /*Fetch data................*/
  fetchDataByCat(cat, page) {
    const { stores } = this.props;
    stores.partner.fetchData(cat, page, this.state.lat, this.state.long)
      .then(data => {
        if (data.length == 0) {
          this.setState({ smallspin: false })
        } else if (page == 1 && data.length < 10) {
          this.setState({ smallspin: false })
        }

        this.setState(state => ({ partnerdata: [...state.partnerdata, ...data], animating: false }));

      })
      .catch(err => console.log(err));
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
    // console.log("end")
    this.setState({
      page: this.state.page + 1
    }, () => {
      this.fetchDataByCat(this.state.param, this.state.page)
    })
    // console.log("end is near....");
  };

  _renderFooter = () => {
    if (this.state.smallspin) {
      return (<Spinkit />)
    } else {
      return null
    }
  }

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
            borderWidth: 0.8,
            elevation: Platform.OS == 'android' ? 0.2 : 0,
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
                }
              ]}>
              <Text
                style={[
                  styles.product_listing_content_title_txt,
                  { marginTop: 10 }
                ]}>
                {item.store_name}
              </Text>
            </View>
            <View style={[styles.product_listing_content_txt2, {
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: 'wrap'
            }]}>
              {/*  Hiding been here and blogs count for now as it's low */}
              {/*  <Text style={styles.product_listing_content_reviews}>
                {item.reviews} Blogs - {item.beenhere} Been here
              </Text> */}
              <Text ellipsizeMode='tail' numberOfLines={1}
                style={[
                  styles.product_listing_content_location,
                  { textAlign: "left" }
                ]}>
                <Icon style={styles.iconCommon} name="map-marker" />{" "}
                {item.locality_name}{","}{item.city_name}
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
              }}
            />
          </View>

          {/*Check timings and show status Open/Closed*/}
          <View style={styles.product_listing_content_bottom}>
            {item.open_status ? (
              <Text style={[styles.product_listing_content_bottom_time, {
                color: item.open_status == 'Open' ?
                  'green' : (item.open_status == 'Closed' ? 'red' : 'orange')
              }]}>
                <Icon style={styles.iconCommon} name="clock-o" />{" "}
                {item.open_status}{(item.open_status == 'Open' || item.open_status == 'Closed') ? " now" : ""}
              </Text>
            ) : (<Text />)}

            {/*Price from and to hiding from the listing
            {item.price_from ? (
              <Text style={styles.product_listing_content_bottom_value}>
                <Icon style={styles.iconCommon} name="inr" /> {item.price_from}{" "}
                to {item.price_to}{" "}
              </Text>
            ) : (<Text />)} */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  resetDesigners() {
    const resetAction = NavigationActions.reset({
      index: 1,
      key: null,
      actions: [
        NavigationActions.navigate({ routeName: 'default' })
      ]
    });
    this.props.navigation.dispatch(resetAction)
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
    // Value from store i.e. this.partnerdata
    const d = this.state.partnerdata;
    if (this.state.animating) {
      return <SpinkitLarge />;
    } else {
      if (d.length > 0) {

        return (
          <View style={[styles.Container]}>
            <View style={{flexDirection: 'row',flex:1, marginBottom:50}}>
            <FlatList
              onRefresh={() => this.onRefresh(this.state.param)}
              refreshing={this.state.isFetching}
              data={d}
              keyExtractor={item => item.id}
              renderItem={this._renderItem}
              removeClippedSubviews={false}
              ListFooterComponent={this._renderFooter}
              onEndReached={this.state.smallspin ? this.LoadMore : null}
              onEndThreshold={100}
              onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
              onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}
            />
            </View>
            {/*Footer*/}
				{/* {
              !this.state.hideHome ?
                <View style={[Style.fixedFooter, { width: 50, height: 50, borderRadius: 100, borderColor: '#E29A0D', right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: '#fff', borderWidth: 0.4, }]}>
                  <TouchableOpacity style={[Style.iconFixFooter]} onPress={() => this.props.navigation.navigate('Main')}>
                    <TabBarIcon icon={Images.icons.news} tintColor={'#E29A0D'} />
                  </TouchableOpacity>
                </View> : null
				}*/}
			
			<View style={[Style.fixedFooter, { bottom: 0, flex: 1, flexDirection: 'row', justifyContent: 'flex-end'  }]}>
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
      } else {
        return (<View style={[styles.Container]}><View><Text style={{ textAlign: 'center', marginTop: 15, fontSize: 15 }} >{'Stores not found'}</Text></View>
          {/*Footer*/}
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
		
		
		
		)
      }
    }
  }
}

export default ListingScreen;
