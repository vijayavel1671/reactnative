'use strict';
import React, {Component} from "react";
import { StyleSheet, Image} from "react-native";
import { Languages, Style, Images, Config , gAnalytics } from "@common";

const styles = StyleSheet.create({
  icon: {
    width: 20,
    resizeMode: 'contain'
  },
});

export default class Index extends Component {
  render() {
    return (
      <Image
        source={{uri: this.props.icon}}
        style={[styles.icon, { height: this.props.icon == Images.icons.star ? 20 : 18, tintColor: this.props.tintColor }]}
       />
    );
  }
}
