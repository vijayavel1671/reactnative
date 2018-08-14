'use strict';
import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity, ScrollView, FlatList,Modal,Alert } from "react-native";
import css from "../Forms/style";
import { Languages, Style, Config, gAnalytics, Images } from "@common";
import { SpinkitLarge, TabBarIcon } from "@components";
import styles from "../../../styles";
import { inject, observer } from "mobx-react";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from 'moment';
import RecentDataScreen from './RecentData';

@inject("stores")
@observer
export default class AppointmentsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      token: null,
      notfound: false,
      isFetching: false,
      pulltext: true,
      data: this.props.stores.user.appointments,
      hideHome: false,
      recentdata: [],
    }

    this.handleNaviParent = this.handleNaviParent.bind(this)

  }

  static navigationOptions = ({ navigation }) => {
  const { navigate } = navigation;
  const { params = {} } = navigation.state;
  return {
    title: 'My Appointments',
  }
};

/*  headerRight: (
        <TouchableOpacity style={{ width: 50, }} onPress={() => params.handlefilter()}>
          <Icon
            name="filter"
            style={{ color: "#000", marginRight: 0, marginLeft: 10, fontSize: 20 }}
          />
        </TouchableOpacity>
    ) */

  componentWillMount() {
    let token = this.props.navigation.state.params.token
    this.setState({ token }, () => {
      this.props.stores.user.getMyAppointments(token)
        .then(res => {
          if (res.status == "success") {
            this.setState({
              data: res.appointments,
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
        })
        .catch(e => console.log(e))
    })
  }

  handleNaviParent = (id) => {
    this.props.navigation.navigate('Product', { id: id })
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


  handlePullText() {
    setTimeout(() => {
      this.setState({ pulltext: false })
    }, 1000)
  }


  onRefresh() {
    this.props.stores.user.getMyAppointments(this.state.token)
      .then(res => {
        if (res.status == "success") {
          this.setState({
            data: res.appointments,
            isFetching: false
          })
        } else {
          this.setState({
            notfound: true,
            loading: false,
            isFetching: false
          })
        }
      })
      .catch(e => console.log(e))
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
            marginTop: 3,
            marginBottom: 0,
            borderColor: "rgba(193, 193, 193, 0.89)",
            borderWidth: 0.8
          }
        ]}
        onPress={() => {
          if (item.status != 'cancelled')
            this.props.navigation.navigate("UpdateAppointment", { id: item.id, token: this.state.token })
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
                { marginTop: 10, fontSize: 20 }
              ]}>
              {item.store}
            </Text>
            <Text style={{
              color: item.status == 'approved' ?
                '#fff' : '#424242', padding: 8, backgroundColor
                : item.status == 'approved' ? '#2E7D32' : '#FDD835',
              width: '28%', textAlign: 'center', marginTop: 8, borderRadius: 8, fontSize: 11
            }} >{item.status.toUpperCase()}</Text>
          </View>
        </View>
        <View
          style={[
            styles.product_listing_content_middle,
            { borderRadius: 0, overflow: "hidden", marginLeft: 10 }
          ]}>
          <Text style={{ fontSize: 13 }} >Date Requested : {item.date_requested}</Text>
          <Text style={{ fontSize: 13 }} >Date Created : {item.created_at}</Text>
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

  _renderFooter = () => {
    if (this.state.recentdata.length > 0){
      return (<View style={{marginTop:10}} >
      <RecentDataScreen recentdata={this.state.recentdata} handleNaviParent={this.handleNaviParent} />
      </View>)
    } else {
      return null
    }
  }


  render() {
    const { appointments } = this.props.stores.user;
    if (this.state.loading) {
      return (<SpinkitLarge />)
    } else {
      if (!this.state.notfound) {
        return (
          <View style={[Style.container,{flex:1}]}>
            <FlatList
              data={appointments}
              keyExtractor={item => item.id}
              renderItem={this._renderItem}
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.isFetching}
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

          <View style={[Style.container,{flex:1}]}>
            <ScrollView onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
              onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}>
            <Text style={{ textAlign: 'center', fontSize: 22, marginTop: '5%' }}>{'No appointments found.'}</Text>
           {
            this.state.recentdata.length > 0 ?
              <RecentDataScreen recentdata={this.state.recentdata} handleNaviParent={this.handleNaviParent} />
              : null}  
          </ScrollView>
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
