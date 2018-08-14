/* @flow */
import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  Image,
  Easing,
  AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import NavigationBar from "react-native-navbar";
import styles from "../../../styles";
import { TabBarIcon, SpinkitLarge } from "@components";
import { Images, Config,gAnalytics,Style } from "@common";
import { inject, observer } from "mobx-react";

@inject("stores")
@observer
export default class NewArrivalsScreen extends Component {
  static navigationOptions = {
    title: "New Arrivals",
    headerMode: "screen"
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      page: "first",
      newarrs: [],
      nonewarrs: false,
      animating: true,
      lat: null,
      long: null,
      lc: null
    };

    gAnalytics.trackScreenView('NewArrivalsPage')
  }

  componentWillMount() {
    this.props.stores.location
      .checkCurrentLocation()
      .then(res => {
        if (res) {
          res = JSON.parse(res);
          if (res.sublocality_level_2) {
            this.setState({ lc: res.sublocality_level_2 });
          } else if (res.sublocality_level_1) {
            this.setState({ lc: res.sublocality_level_1 });
          } else if (res.locality) {
            this.setState({ lc: res.locality });
          }

          this.setState({ lat: res.latitude, long: res.longitude }, () => {
            this.getData(res.latitude, res.longitude);
          });
        } else {
          this.getData(this.state.lat, this.state.long);
        }
      })
      .catch(e => console.log(e));
  }

  getData(latitude, longitude) {
    this.props.stores.misc
      .getNewArrivals(latitude, longitude)
      .then(res => {
        if (res.status == "success") {
          this.setState({ newarrs: res.new_arrivals, animating: false },() => {
              this.handleAnalytics()
          });
        } else {
          this.setState({ nonewarrs: true, animating: false });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleAnalytics(){
      AsyncStorage.getItem("usertoken")
        .then(item => {
          if(item){
            this.props.stores.user.getuserInfoBasic()
              .then(data => {
                  let d = JSON.parse(data)
                  gAnalytics.setUser(d.id.toString());
              }).catch(err => console.log(err))
           }
            gAnalytics.trackEvent('newarrivals','view',
              {name : 'NewArrivalsPage',location:this.state.lc});
        }).catch(e => console.log(e))
  }

  render() {
    if (this.state.animating) {
      return <SpinkitLarge />;
    } else {
      if (this.state.nonewarrs) {
        return (
          <View>
            <Text
              style={{ marginTop: 15, textAlign: "center", fontWeight: "500" }}>
              {'No new arrivals. Come back later!'}
            </Text>
          </View>
        );
      } else {
        const NewArrivalsList = this.state.newarrs;
        return (
          <View style={[styles.Container]}>
            <ScrollView style={{marginBottom:50}}>
              {NewArrivalsList.map(item => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.9}
                    style={styles.home_banner_section}
                    onPress={() =>
                      this.props.navigation.navigate("StoreProductCollection", {
                        cid: item.collection_id,
                        storename: item.store_name
                      })
                    }>
                    <Image
                      style={styles.home_banner_section_img}
                      source={{
                        uri: item.mobile_image
                          ? Config.BaseUrl + item.mobile_image
                          : Config.NoImageUrl
                      }}
                    />
                    <View style={styles.home_banner_section_txt_view}>
                      <Text style={styles.home_banner_section_txt}>
                        {item.new_arrival_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
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
}
