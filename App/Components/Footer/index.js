'use strict';
import React, { Component } from "react";
import { TouchableOpacity, Image, View } from "react-native";
import { Languages, Style, Config, Color, gAnalytics, Images } from "@common";
import { TabBarIcon } from "@components";

export default class Index extends Component {
    render() {
        return (
            <View style={Style.fixedFooter}>
                <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}>
                    <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
                </TouchableOpacity>
                <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Directory')}>
                    <TabBarIcon icon={Images.icons.user} tintColor={'#fff'} />
                </TouchableOpacity>
                <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Favorites')}>
                    <TabBarIcon icon={Images.icons.star} tintColor={'#fff'} />
                </TouchableOpacity>
            </View>
        )
    }
}