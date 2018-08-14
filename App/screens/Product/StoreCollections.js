import React from "react";
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    Image,
    ScrollView,
    StatusBar,
    AsyncStorage,
    ToastAndroid,
    Platform,
    Linking,
    Alert
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Languages, Style, Config,Color,Images } from "@common";
import styles from "../../../styles";
import { TabBarIcon } from "@components";

export default class StoreCollections extends React.Component{

    constructor(props){
        super(props);
        this.state = {
              collection : this.props.collectiondata
        }
    }
// this.state.store.store_collection
    render(){
        if(this.state.collection.length > 0){
            return(
			
				<View style={styles.container}>
                <View style={{marginBottom : 15 , marginTop: 10,paddingBottom:15,  paddingLeft: '2.5%', paddingRight: '2.5%' }} >
                 <Text style={{ marginTop : 5,textAlign : 'center',fontWeight:'600',
                                    marginBottom:5, width: '100%', color: '#E29A0D' }}>Collections</Text>


                <ScrollView  
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                alwaysBounceHorizontal={true}
                >

                                <View style={[Style.product_bottom_cat_section]}>

                                        {
                                            this.state.collection.map(collection => {
                                                   return (
                                                         <TouchableOpacity
                                                            key={collection.id}
                                                            style={[styles.browseCategory_col,{width:150, marginRight: 10}]}
                                                            onPress={() => this.props.handleCPNavigation(collection.id)}>
                                                            <Image
                                                                style={[Style.product_bottom_cat_img, { width: '100%', height: 180}]}
                                                                source={{uri: Config.BaseUrl + collection.image}}
                                                                resizeMode={'contain'}
                                                                />
                                                            <View style={[Style.product_bottom_cat_view, {marginLeft: 0, left: 0, width: '100%', height: '100%', borderRadius: 5}]}>
                                                                <Text style={Style.product_bottom_cat_txt}>
                                                                    {collection.collection_name}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>

                                                    )
                                            })
                                        }
                              </View>
                            </ScrollView>
                        </View>
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
        }else{
            return (<View style={styles.container}>
			
			<View style={Style.fixedFooter}>
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
			</View>)
        }
    }

}

/*              <ScrollView
                style={[styles.rowFlex, { marginTop: 10 }]}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {hct.map(item => {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.browseCategory_col}
                      onPress={() =>
                        navigate("Listing", { cid: item.id, name: item.name })}>
                      <Image
                        style={styles.browseCategory_img}
                        source={{
                          uri: item.thumbnail
                            ? baseUrl + item.thumbnail
                            : Config.NoImageUrl
                        }}/>
                      <Text style={styles.browseCategory_desc}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>*/
