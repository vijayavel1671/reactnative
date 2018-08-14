import React, { Component } from 'react'
import { 
  Text, 
  View,
  FlatList,
  Alert,
  Image,
  Dimensions
} from 'react-native'
import styles from "../../../styles";
import { Config } from "@common";
const APP_WIDTH = Dimensions.get("window").width;
const home_banner_section_height=(APP_WIDTH * 40)/100;

export default class HomeNews extends Component {  

  render() {
    const{data}=this.props;
    return (
      <View  >
        <View>
          <Text style={{textAlign: 'center',fontSize:28,color:'#333333'}} >WE CREATE NEWS</Text>
        </View>
       <View style={{width:APP_WIDTH}}>
                <FlatList
                  data={data}
               
                  extraData={data}              
                  horizontal={true}
                  renderItem={({item,index}) => <View style={{backgroundColor: 'white',width:APP_WIDTH/2,flex: 1, flexDirection: 'row',marginLeft:5}}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        width: APP_WIDTH                                             
                      }}>
                      <View key={`event_images_${index}`} style={{width: APP_WIDTH/2,  backgroundColor: '#E2E3E5',paddingTop:0,height:APP_WIDTH/3}} >
                                              <Image  
                                                style={{width: APP_WIDTH/2,height:home_banner_section_height}}        
                                                source={{                                                  
                                                  uri:item.mobile_image?Config.BaseUrl+item.mobile_image:Config.NoImageUrl                                                
                                                }}/>
                                              </View>
                                          <View style={{width: APP_WIDTH/2,  backgroundColor: '#E2E3E5',paddingLeft:15,paddingRight:15,height:APP_WIDTH/3.8}} >
                                            <Text style={{textAlign: 'center',fontSize:20,color:'#333333'}} >{item.title}</Text>

                                            <Text style={{textAlign: 'center',fontSize:10,justifyContent:'center',color:'#333333'}} numberOfLines={3} >{item.description}</Text>
                                           
                                          </View>
                                          </View> 
                                        </View>}
                />               
              </View>
            <View style={{backgroundColor: 'white',flex: 1, flexDirection: 'row',paddingTop:20,paddingRight:10,justifyContent: 'flex-end',alignItems: 'flex-end'}}>
              <Text style={{fontWeight: "bold",textAlign: 'right',color:'#333333'}}> > View more</Text>
            </View>
      </View> 
    )
  }
}
