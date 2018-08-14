/* @flow */

import { Text, TouchableOpacity, ScrollView, StyleSheet,Button,View} from 'react-native';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import {Style,Images} from "@common";
import { TabBarIcon } from "@components";

export default class UserScreen extends Component {


    static navigationOptions = {
    title: 'User',
    headerMode: 'screen',
  }


  render() {
    const styles = StyleSheet.create({
      background: {
        padding: 30,
      },
    });

    return (
      <View style={Style.container}>
      <ScrollView style={styles.background}>
        <TouchableOpacity>
          <Text>
           Hello User..................
          </Text>
        </TouchableOpacity>
        <Button title="Shops" onPress={ () =>  this.props.navigation.navigate('Shops')}>
        </Button>
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
