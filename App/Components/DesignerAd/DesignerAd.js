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

export default class DesignerAd extends Component {

    constructor(props) {
		super(props);
		this.state = {
     
        };
    
    }
    
    render() {
        const{data}=this.props;
        return (
          <View>
            <View style={{width:APP_WIDTH,height:APP_WIDTH/2,flex:1,flexDirection:'row',margin:5}}>

                <View style={{width:(APP_WIDTH*2)/3,height:APP_WIDTH/2,flex:1,flexDirection:'column'}}>

                    <View style={{width:(APP_WIDTH*2)/3,height:APP_WIDTH/4,marginBottom: 5}}>

                         <Image 
                                                    style={{width:(APP_WIDTH*2)/3,height:APP_WIDTH/4}}                                              
                                                     source={{
                                                        uri: data[0].mobile_image
                                                          ? baseUrl + data[0].mobile_image
                                                          : Config.NoImageUrl
                                                      }}                                            
                                                  />

                    </View>
                    <View style={{width:(APP_WIDTH*2)/3,height:APP_WIDTH/4,flex:1,flexDirection:'row'}}>

                        <View style={{width:(APP_WIDTH*3)/16,height:APP_WIDTH/4,marginRight: 5}}>

                            <Image 
                                                    style={{width:(APP_WIDTH*3)/16,height:APP_WIDTH/4}}                                              
                                                     source={{
                                                        uri: data[2].mobile_image
                                                          ? baseUrl + data[2].mobile_image
                                                          : Config.NoImageUrl
                                                      }}                                            
                                                  />

                        </View>

                        <View style={{width:(APP_WIDTH*9)/16,height:APP_WIDTH/4}}>

                            <Image 
                                                    style={{width:(APP_WIDTH*9)/16,height:APP_WIDTH/4}}                                              
                                                     source={{
                                                        uri: data[3].mobile_image
                                                          ? baseUrl + data[3].mobile_image
                                                          : Config.NoImageUrl
                                                      }}                                            
                                                  />
                        </View>

                    </View>

                </View>
                <View style={{width:APP_WIDTH/3,height:APP_WIDTH/2,marginLeft: 5}}>
                    
                    <Image 
                                                    style={{width:APP_WIDTH/4,height:APP_WIDTH/2}}                                              
                                                     source={{
                                                        uri: data[1].mobile_image
                                                          ? baseUrl + data[1].mobile_image
                                                          : Config.NoImageUrl
                                                      }}                                            
                                                  />
                </View>
                    {/*<FlatList
                      data={data}
                   
                      extraData={data}               
                      horizontal={true}
                      renderItem={({item}) => <View style={{backgroundColor: 'white',width:APP_WIDTH/4 ,flex: 1, flexDirection: 'row'}}>
                                                                  
                                                
                                                  <Image 
                                                    style={{width:APP_WIDTH/4,height:APP_WIDTH/4}}                                              
                                                     source={{
                                                        uri: item.mobile_image
                                                          ? baseUrl + item.mobile_image
                                                          : Config.NoImageUrl
                                                      }}                                            
                                                  />
                                                
                                            </View>}
                                                    />*/}
                   
            </View>
              
          </View>
        )
      }


}