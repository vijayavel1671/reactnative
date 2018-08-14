/* @flow */
import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Images,Style,gAnalytics } from "@common";
import NavigationBar from "react-native-navbar";
import styles from "../../../styles";
import { TabBarIcon } from "@components";


export default class AboutUsScreen extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      hideHome: false,
    }

    gAnalytics.trackScreenView('AboutUsPage')
  }

  static navigationOptions = {
    title: 'About us',
    headerMode: 'float',
  }



  handlePress(type) {
    let url = ''
    if (type == 'mail') {
      url = 'mailto:info@zingbi.com'
    } else {
      url = 'https://www.zingbi.com'
    }
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.error("Can't handle url: " + url);
        } else {
          Linking.openURL(url)
            .then(data => { })
            .catch(err => {
              throw err;
            })
        }
      })
      .catch(err => console.error("An error occurred", err));
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

  render() {
    return (
     <View style={[styles.Container]}> 
		 {/*<ScrollView style={{ backgroundColor: '#fff' }} onScroll={this.onScrollEvent}>*/}
		<ScrollView>
        <View style={styles.pageWrapper} >
          <Text style={styles.pageWrapperContent} >

            The <Text style={{ fontWeight: '600' }} onPress={() => this.handlePress('url')} >www.zingbi.com</Text> marketplace is operated by <Text style={{ fontWeight: '600' }}>Zingbi Lifestyle India Private ltd</Text>.
            Zingbi.com seeks to build the most customer-centric online destination for customers to find and discover virtually anything
            they want to buy online by giving them more of what they want – vast selection, low prices, fast and reliable delivery, and a trusted and
            convenient experience; and provide sellers with a world-class e-commerce platform.{"\n"}{"\n"}

            <Text>For media inquiries only: <Text style={{ color: 'blue' }} onPress={() => this.handlePress('mail')}>info@zingbi.com</Text>{"\n"}</Text>
            <Text>For customer service: <Text style={{ color: 'blue' }} onPress={() => this.handlePress('mail')}>info@zingbi.com</Text> {"\n"}</Text>
            <Text>For queries regarding showcasing your store on <Text style={{ fontWeight: '600' }} onPress={() => this.handlePress('url')} >
              www.zingbi.com</Text> : <Text style={{ color: 'blue' }} onPress={() => this.handlePress('mail')}>info@zingbi.com{"\n"}</Text></Text>

            <Text>Registered office address:  <Text style={{ color: 'blue' }} onPress={() => this.handlePress('mail')}>info@zingbi.com</Text>{"\n"}{"\n"}</Text>
            <Text style={{ fontWeight: '600' }} >ZINGBI LIFESTYLE INDIA PRIVATE LIMITED{"\n"}
              No 5,aishwarya nagar,{"\n"}
              2nd main road,{"\n"}
              3rd cross street,{"\n"}
              ayanambakkam,{"\n"}
              chennai-600095{"\n"}{"\n"}
            </Text>
            <Text>To all of you, from all of us at Zingbi Store - Thank you and Happy Shopping!</Text>
          </Text>
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

    )
  }


}
