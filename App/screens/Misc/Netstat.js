'use strict';
import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity, TextInput, ScrollView, Switch, Picker } from "react-native";
import css from "../Forms/style";
import { Languages, Style,Images } from "@common";
import { Spinkit,TabBarIcon } from "@components";
import RNRestart from 'react-native-restart'; // Import package from node modules
import DeviceSettings from 'react-native-device-settings'; //DeviceSettings.open();

export default class NetStatScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    static navigationOptions = {
       header : null
    }

    render() {
        return (
            <View style={Style.container}>
                    <Text style={{ textAlign: 'center', fontSize: 20, marginTop: '35%' }}>Seems like you are offline.</Text>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center', }}>
                        <TouchableOpacity
                        style={[Style.darkButton, { width: "30%", marginRight: 10 }]}
                        onPress={() => { RNRestart.Restart() }} >
                            <Text>
                                {'Retry'}
                            </Text>
                        </TouchableOpacity>

                    <TouchableOpacity
                        style={[Style.darkButton, { width: "30%", marginLeft: 10 }]}
                        onPress={() => { DeviceSettings.open()  }} >
                            <Text>
                                {'Settings'}
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
        );
    }
}