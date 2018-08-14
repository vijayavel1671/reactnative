import React, { Component } from 'react'
import { 
  Text, 
  View,
  FlatList,
  Alert,
  Image,
  Dimensions,
  TouchableOpacity 
} from 'react-native'
import styles from "../../../styles";
import { Config } from "@common";

import IconSet from './IconSet';

const APP_WIDTH = Dimensions.get("window").width;
const home_banner_section_height=(APP_WIDTH * 40)/100;



export default class HomeEvents extends Component {
  

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
                  renderItem={({item,index}) => <View style={{backgroundColor: 'white',width:380,flex: 1, flexDirection: 'row',marginLeft:5}}>
                                            <View style={{width: 180,  backgroundColor: '#E2E3E5',padding:15}} >
                                              <Text style={{textAlign: 'center',fontSize:20,color:'#333333'}} >{item.event_name}</Text>
                                              <Text style={{textAlign: 'center',fontSize:10,justifyContent:'center',color:'#333333'}} numberOfLines={6} >{item.short_description}</Text>
                                              <Text style={{textAlign: 'center',fontSize:20,color:'#A1A1A1',marginTop:5}}  >{item.from_date.month}, {item.from_date.date}, {item.from_date.year}</Text>
                                            </View>
                                            <View style={{flex: 1, flexDirection: 'column',width: 50,backgroundColor: 'white',alignItems:'center',justifyContent: 'center'}}>
                                              <IconSet key={`icon_star_${index}`} data={item} type="star" />
                                              <IconSet key={`icon_chk_${index}`} data={item} type="check" />
                                              <IconSet key={`icon_back_${index}`} data={item} type="back" />
                                              <IconSet key={`icon_time_${index}`} data={item} type="time" />
                                                                                 
                                            </View>
                                            <View key={`event_images_${index}`} style={{width: 150}}>
                                              <Image  
                                                style={{width: home_banner_section_height,height:home_banner_section_height}}                                          
                                                source={{                                                  
                                                  uri:item.event_icon_banner_image?Config.BaseUrl+item.event_icon_banner_image:Config.NoImageUrl                                                
                                                }}/>
                                            </View>
                                        </View>}
                />
               
              </View>
            <View style={{backgroundColor: 'white',flex: 1, flexDirection: 'row',padding:5,justifyContent: 'flex-end',alignItems: 'flex-end'}}>
              <Text style={{fontWeight: "bold",textAlign: 'right',color:'#333333'}}> > View more</Text>
            </View>
      </View>
    )
  }
}
