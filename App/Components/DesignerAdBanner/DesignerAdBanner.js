import React, { Component } from 'react'
import { 
  Text, 
  View,
  FlatList,
  Dimensions,
  Alert,
  Image,
  TouchableOpacity 
} from 'react-native'
import styles from "../../../styles";
import { Config } from "@common";

const APP_WIDTH = Dimensions.get("window").width;
const baseUrl = Config.BaseUrl;

export default class DesignerAdBanner extends Component {

    constructor(props) {
		super(props);
		this.state = {
     
        };
    
    }
    
    render() {
        const{data}=this.props;
        return (
          <View>
          <View style={styles.home_banner_section}>
                    <FlatList
                      data={data}
                   
                      extraData={data}               
                      horizontal={true}
                      renderItem={({item}) => <View style={{backgroundColor: 'white',width:APP_WIDTH ,flex: 1, flexDirection: 'row'}}>
                                                                  
                                                
                                                  <Image 
                                                    style={[styles.home_banner_section_img]}                                              
                                                     source={{
                                                        uri: item.mobile_image
                                                          ? baseUrl + item.mobile_image
                                                          : Config.NoImageUrl
                                                      }}                                            
                                                  />
                                                
                                            </View>}
                    />
                   
                  </View>
              
          </View>
        )
      }


}