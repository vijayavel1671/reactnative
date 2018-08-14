import React, { Component } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  AsyncStorage,
  Alert,FlatList
} from "react-native";
import { SpinkitLarge,Spinkit,TabBarIcon } from "@components";
import { Languages, Style, Config,Images } from "@common";
import styles from "../../../styles";
import { inject, observer } from "mobx-react";

@inject("stores")
@observer
export default class RecentDataScreen extends Component {

	constructor(props){
			super(props);
			this.state = {
				recentdata : this.props.recentdata
      }
		}

   handleNav(id){
      this.props.handleNaviParent(id)
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
            marginTop: 10,
            marginBottom: 5,
            borderColor: "rgba(193, 193, 193, 0.89)",
            borderWidth: 0.8
          }
        ]}
        onPress={() => this.handleNav(item.id)}>
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
                { marginTop: 10 }
              ]}>
              {item.store_name}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.product_listing_content_middle,
            { borderRadius: 0, overflow: "hidden" }
          ]}>
          <Image
            style={[
              styles.product_listing_content_img,
              { borderRadius: 0, overflow: "hidden" }
            ]}
            source={{
              uri: item.mobile_banner
                ? Config.BaseUrl + item.mobile_banner
                : Config.NoImageUrl
            }} />
        </View>

      </TouchableOpacity>
    )
  }

	render(){
    return (
        <View style={{}}>
              <Text style={{ textAlign: "center",marginBottom:10,marginTop:10, color: "#000",fontSize:17 }}>
                {'See recently viewed'}
                
              </Text>
              <View
            style={{
              borderBottomColor: 'gold',
              marginLeft: 90,
              borderBottomWidth: 3,
              width:'50%',
              aligSelf:'center',
              justifyContent:'center',
              alignContent:'center'}}
              ></View>
                    <FlatList
                      data={this.state.recentdata}
                      keyExtractor={item => item.id}
                      renderItem={this._renderItem}
                      />
					  
					  {/*<View style={Style.fixedFooter}>
							 <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}> 
								 <TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
							 </TouchableOpacity>
							  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Designers')}> 
								 <TabBarIcon icon={Images.icons.user} tintColor={'#fff'} />
							 </TouchableOpacity>
							  <TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Favorites')}> 
								 <TabBarIcon icon={Images.icons.star} tintColor={'#fff'} />
							 </TouchableOpacity>
					  </View>*/}

        </View>	  
					  
          
		)
	}
}