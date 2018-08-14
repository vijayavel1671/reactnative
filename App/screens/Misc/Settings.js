'use strict';
import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity, TextInput, ScrollView, Switch, Alert } from "react-native";
import css from "../Forms/style";
import { Languages, Style,Images } from "@common";
import { Spinkit,TabBarIcon } from "@components";
import styles from "../../../styles";
import { inject, observer } from "mobx-react";

@inject("stores")
@observer
export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      token: null,
      push: false,
      news: false,
      hideHome : false
    }
  }

  static navigationOptions = {
    title: 'Settings',
    headerMode: 'float',
  }

  componentWillMount() {
    let token = this.props.navigation.state.params.token;
    this.setState({ token })
  }

  handleNewsLetter = (news) => {
    this.setState({ news })
  }

  handlePush = (push) => {
    this.setState({ push })
  }

  handleReportError() {
    if (this.state.token) {
      this.props.navigation.navigate("ReportError", {
        store_id: null,
        error_type: "general"
      });
    } else {
      Alert.alert('Report Error',
        'You must be logged in to perform this action',
        [
          { text: 'Cancel', onPress: () => { }, style: 'cancel' },
          {
            text: 'LOG IN',
            onPress: () => this.props.navigation.navigate('UserProfileScreen')
          },],
        { cancelable: false })
    }
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
  //  signup for zingbi letters on/off, push notification on/off, sign​-​out
  render() {
    return (
      <View style={Style.container}>
        <ScrollView style={css.wrap} onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
          onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}>
          <TouchableOpacity
            key={3}
            onPress={() => {
              this.props.navigation.navigate("TermsAndConditions", {});
            }}>
            <Text style={{ textAlign: 'left', fontSize: 18, marginTop: 14 }}>{"Terms & Conditions"}</Text>
          </TouchableOpacity>
          <View
            style={{
              borderBottomColor: '#f0f0f0',
              borderBottomWidth: 1,
              marginTop: 14,
              marginBottom: 13
            }}/>
          <TouchableOpacity
            key={9}
            onPress={() => {
              this.props.navigation.navigate("ContactUs", {});
            }}>
            <Text style={{ textAlign: 'left', fontSize: 18, marginTop: 14 }}>{"Contact Us"}</Text>
          </TouchableOpacity>
          <View
            style={{
              borderBottomColor: '#f0f0f0',
              borderBottomWidth: 1,
              marginTop: 14,
              marginBottom: 13
            }}/>
          <TouchableOpacity
            key={11}
            onPress={() => {
              this.handleReportError()
            }}>
            <Text style={{ textAlign: 'left', fontSize: 18, marginTop: 14 }}>{"Report Error"}</Text>
          </TouchableOpacity>
          <View
            style={{
              borderBottomColor: '#f0f0f0',
              borderBottomWidth: 1,
              marginTop: 14,
              marginBottom: 13
            }}/>
        </ScrollView>
        {/*
          !this.state.hideHome ?
            <View style={[Style.fixedFooter, {
              width: 50, height: 50, borderRadius: 100,
              right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end'
            }]}>
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
  }
}
