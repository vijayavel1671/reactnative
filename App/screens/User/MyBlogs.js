'use strict';
import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity, ScrollView, FlatList } from "react-native";
import css from "../Forms/style";
import { Languages, Style, Config, Images } from "@common";
import { SpinkitLarge, TabBarIcon, Spinkit } from "@components";
import styles from "../../../styles";
import moment from 'moment';
import { inject, observer } from "mobx-react";
import RecentDataScreen from './RecentData';

@inject("stores")
@observer
export default class MyBLogsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      token: null,
      notfound: false,
      hideHome: false,
      recentdata: [],
    }

    this.handleNaviParent = this.handleNaviParent.bind(this)
  }

  static navigationOptions = {
    title: 'My Blogs',
    headerMode: 'float',
  }


  componentWillMount() {

    let { token } = this.props.navigation.state.params

    this.setState({ token }, () => {
      this.props.stores.user.getMyBlogs(token)
        .then(res => {
          if (res.status == "success") {
            if (res.blogs.length !== 0) {
              this.setState({
                data: res.blogs,
                loading: false
              }, () => {
                this.getRec(token);
              })
            } else {
              this.setState({
                notfound: true,
                loading: false
              }, () => {
                this.getRec(token);
              })
            }
          } else {
            this.setState({
              notfound: true,
              loading: false
            }, () => {
              this.getRec(token);
            })
          }
        })
        .catch(e => console.log(e))
    })
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
            borderRadius: 10,
            marginTop: 10,
            marginBottom: 5,
            borderColor: "rgba(193, 193, 193, 0.89)",
            borderWidth: 0.8
          }
        ]}
        onPress={() => this.props.navigation.navigate("Blog", { id: item.id, editBlog: true })}>
        <View
          style={[
            styles.product_listing_content_middle,
            { borderRadius: 10, overflow: "hidden" }
          ]}>
          <Image
            style={[
              styles.product_listing_content_img,
              { borderRadius: 10, overflow: "hidden" }
            ]}
            source={{
              uri: item.image
                ? Config.BaseUrl + item.image
                : Config.NoImageUrl
            }}
          />
        </View>
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
                { marginTop: 10, fontSize: 15 }
              ]}>
              {item.title.substr(0, 30)}{item.title.length > 30 ? '...' : ''}
            </Text>
            {item.store_id ? <Text
              style={[
                styles.product_listing_content_title_txt,
                { marginTop: 10, fontSize: 17 }
              ]}
              onPress={() => this.props.navigation.navigate('Product', { id: item.store_id })}>
              {item.store_name}
            </Text> : null}
          </View>
          <View>
            <Text>{'Published '}{moment(item.created_at).fromNow()} </Text>
          </View>

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

  getRec = (token) => {
    this.props.stores.partner
      .recentViewStores(token)
      .then(success => {
        if (success.status == "success") {
          this.setState({
            recentdata: success.recently_viewed,
          });
        } else {
          this.setState({
            recentdata: [],
          });
        }
      })
      .catch(err => console.log(err));
  }

  handleNaviParent = (id) => {
    this.props.navigation.navigate('Product', { id: id })
  }

  _renderFooter = () => {
    if (this.state.recentdata.length > 0) {
      return (<View style={{ marginTop: 10 }} >
        <RecentDataScreen recentdata={this.state.recentdata} handleNaviParent={this.handleNaviParent} />
      </View>)
    } else {
      return null
    }
  }

  render() {
    if (this.state.loading) {
      return (<SpinkitLarge />)
    } else {
      if (!this.state.notfound) {
        return (

          <View style={[Style.container, { flex: 1 }]}>
            <FlatList
              data={this.state.data}
              keyExtractor={item => item.id}
              renderItem={this._renderItem}
              onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
              onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}
              ListFooterComponent={this._renderFooter}
            />
			
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

            {/*
              !this.state.hideHome ?
                <View style={[Style.fixedFooter, { width: 50, height: 50, borderRadius: 100, right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }]}>
                  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}>
                    <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
                  </TouchableOpacity>
                </View> : null
            */}
          </View>
        );
      } else {
        return (
          <View style={[Style.container, { flex: 1 }]} >
            <ScrollView style={[Style.container, {marginBottom:50}]} onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
              onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}>
              <Text style={{ textAlign: 'center', fontSize: 22, marginTop: '5%' }}>{'No blogs found.'}</Text>
              {this.state.recentdata.length > 0 ?
                <RecentDataScreen recentdata={this.state.recentdata} handleNaviParent={this.handleNaviParent} />
                : null}
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
            {/*
              !this.state.hideHome ?
                <View style={[Style.fixedFooter, { width: 50, height: 50, borderRadius: 100, right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }]}>
                  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}>
                    <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
                  </TouchableOpacity>
                </View> : null
            */}
          </View>
        )
      }
    }
  }
}
