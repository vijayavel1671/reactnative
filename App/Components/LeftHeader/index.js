/* @flow */
import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  Image,
  AsyncStorage,
  Easing
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import NavigationBar from "react-native-navbar";
import styles from "../../../styles";
import Stores from "../../stores/stores";
import { inject, observer, observable } from "mobx-react";
const stores = new Stores();


@observer
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lc: stores.location.locationname,
    }
  }
  
  componentWillMount() {
    setTimeout(() => {
      this.setLocationL()
    }, 50)
  }

  setLocationL() {
    stores.location
      .checkCurrentLocation()
      .then(res => {
        if (res) {
          let location = JSON.parse(res);
          if (location.sublocality_level_2) {
            this.setState({ lc: location.sublocality_level_2 });
          } else if (location.sublocality_level_1) {
            this.setState({ lc: location.sublocality_level_1 });
          } else if (location.locality) {
            this.setState({ lc: location.locality });
          }
        } else {
          this.setState({ lc: 'India' })
        }
      })
      .catch(err => {
        console.log("location setting error")
        console.log(err);
      });
  }

  render() {
    return (
      <Text style={[styles.topMenuTitle, { color: '#E29A0D' }]} >
        <Icon name={"map-marker"} style={{ color: '#E29A0D' }} />{' '}{this.state.lc}
      </Text>

    )
  }
}
