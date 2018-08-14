'use strict';
import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity, TextInput, ScrollView, Alert, FlatList, AsyncStorage } from "react-native";
import css from "../Forms/style";
import { Languages, Style, Config, Images } from "@common";
import { SpinkitLarge, TabBarIcon } from "@components";
import { inject, observer } from "mobx-react";
import styles from "../../../styles";

@inject("stores")
@observer
export default class RecentlyViewedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      recentdata: [],
      isFetching: false,
      hideHome: false
    }
  }

  static navigationOptions = {
    title: 'Recently Viewed',
    headerMode: 'float',
  }

  componentWillMount() {
    let token = this.props.navigation.state.params.token;
    this.setState({ token }, () => {
      /*Check if recently viewed data is present too....*/
      this.props.stores.partner
        .recentViewStores(token)
        .then(success => {
          if (success.status == "success") {
            this.setState({
              recentdata: success.recently_viewed,
              recentdata_present: true,
              loading: false
            });
          } else {
            this.setState({
              recentdata: success.recently_viewed,
              recentdata_present: false,
              loading: false
            });
          }
        })
        .catch(err => console.log(err));
    });
  }
  onRefresh() {
    this.setState({ isFetching: true }, () => {
      this.props.stores.partner
        .recentViewStores(this.state.token)
        .then(success => {
          if (success.status == "success") {
            this.setState({
              recentdata: success.recently_viewed,
              recentdata_present: true,
              loading: false,
              isFetching: false
            });
          } else {
            this.setState({
              recentdata: success.recently_viewed,
              recentdata_present: false,
              loading: false,
              isFetching: false
            });
          }
        })
        .catch(err => console.log(err));
    })
  }

  btnSignUp() {
    console.log("yay");
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
            borderWidth: 0.8
          }
        ]}
        onPress={() =>
          this.props.navigation.navigate("Product", { id: item.id })}>
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
                ? Config.BaseUrl + item.mobile_banner
                : Config.NoImageUrl
            }} />
        </View>

      </TouchableOpacity>
    )
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
    if (this.state.loading) {
      return (<SpinkitLarge />)
    } else {
      if (this.state.recentdata_present) {
        return (
          <View style={Style.container}>
            <FlatList
              data={this.state.recentdata}
              keyExtractor={item => item.id}
              renderItem={this._renderItem}
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.isFetching}
              onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
              onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}
            />
            {/*
              !this.state.hideHome ?
                <View style={[Style.fixedFooter, { width: 50, height: 50, borderRadius: 100, right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }]}>
                  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}>
                    <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
                  </TouchableOpacity>
                </View> : null
            */}
			
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
      } else {
        return (
          <View style={Style.container}>
            <Text style={{ textAlign: 'center', fontSize: 22, marginTop: '35%' }}>Stores not found.</Text>
            {/*
              !this.state.hideHome ?
                <View style={[Style.fixedFooter, { width: 50, height: 50, borderRadius: 100, right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }]}>
                  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}>
                    <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
                  </TouchableOpacity>
                </View> : null
            */}
			
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
        )
      }
    }
  }
}
