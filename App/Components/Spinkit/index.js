import React, {Component} from "react";
import {View, ActivityIndicator} from "react-native";
import css from "./style";
import Color from "@common/Color";

export default class Index extends Component {
  render() {
    return (
      <View style={[css.spinner, typeof this.props.css != 'undefined' ? this.props.css : null]}>
        <ActivityIndicator color={'#E29A0D'} />
      </View>
    )
  }
}
