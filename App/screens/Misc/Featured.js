'use strict';
import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity, TextInput, ScrollView, Switch, Picker } from "react-native";

import { Languages, Style ,Images } from "@common";
import { Spinkit,TabBarIcon } from "@components";

export default class FeaturedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  static navigationOptions = {
    title: 'Featured',
    headerMode: 'float',
  }

  render() {
    return (
	<View style={Style.container}>
      <ScrollView onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
        onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}>
        <View>
          <Text style={{ textAlign: 'center', fontSize: 20, marginTop: '35%' }}>Coming Soon</Text>
        </View>
      </ScrollView>
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
