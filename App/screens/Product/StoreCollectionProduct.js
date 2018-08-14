import React, { Component } from "react";
import {
    Dimensions,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    ScrollView,
    AsyncStorage
} from "react-native";
import { RkModalImg } from "react-native-ui-kitten";
import { SpinkitLarge,TabBarIcon } from "@components";
import { Languages, Style, Config, gAnalytics,Images } from "@common";
import styles from "../../../styles";
import { inject, observer } from "mobx-react";
import Gallery from 'react-native-photo-gallery';


let size = (Dimensions.get('window').width - 12) / 3;

@inject("stores")
@observer
export default class StoreCollectionProductScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            storeProducts: [],
            stpimages: [],
            loading: true,
            curIndex: 0,
            shown: false,
            nocproducts: false,
            store: null,
            storename: '',
            collectionid: null
        };
        gAnalytics.trackScreenView('StoreCollectionPage')
    }
   static navigationOptions = ({ navigation }) => {
        const { navigate } = navigation;
        const { params = {} } = navigation.state;
        return {
            title: params.storename + " Collection",
        }
    }



    componentWillMount() {
        let paramId = this.props.navigation.state.params.cid;
        let storename = this.props.navigation.state.params.storename;

        this.setState({
            storename,
            collectionid: paramId
        }, () => {
            this.handleAnalytics();

            this.props.stores.partner
                .getstcp(paramId)
                .then(res => {
                    // console.log(res)
                    if (res.status == "success") {
                        if (res.collection_images.length > 0) {
                            res.collection_images.map((item, index) => {
                                this.state.stpimages.push(
                                    {
                                        id: index,
                                        image: { uri: Config.BaseUrl + item.image },
                                        thumb: { uri: Config.BaseUrl + item.image }
                                    }
                                );
                            });
                            // console.log(this.state.stpimages)
                            this.setState({
                                storeProducts: res.collection_images,
                                store: res.store
                            }, () => {
                                setTimeout(() => {
                                    this.setState({ loading: false, })
                                }, 500);
                            });
                        } else {
                            this.setState({ nocproducts: true });
                        }
                    } else {
                        this.setState({ loading: false, nocproducts: true });
                    }
                })
                .catch(err => console.log(err));
        })
    }

    handleAnalytics() {
        AsyncStorage.getItem("usertoken")
            .then(item => {
                if (item) {
                    this.props.stores.user.getuserInfoBasic()
                        .then(data => {
                            let d = JSON.parse(data)
                            gAnalytics.setUser(d.id.toString());
                        }).catch(err => console.log(err))
                }
                gAnalytics.trackEvent('storecollection', 'view', {
                    name: 'StoreCollectionPage',
                    storeName: this.state.storename,
                    collectionId: this.state.collectionid
                });
            }).catch(e => console.log(e))
    }

    _renderHeader(options) {
        return (
            <View style={styles2.header}>
                <TouchableOpacity onPress={options.closeImage}><Text style={{ color: '#fff' }} >Close</Text></TouchableOpacity>
                <TouchableOpacity>
                    <Text style={{ color: '#fff' }} >{`${options.pageNumber}/${options.totalPages}`}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    openModal(i) {
        console.log("hey")
        console.log(i)
    }

    render() {
        let size = (Dimensions.get('window').width - 12) / 3;
        if (this.state.loading) {
            return <SpinkitLarge />;
        } else {
            if (this.state.nocproducts) {
                return (
                    <View style={styles.container}>
                        <Text style={{ textAlign: "center", marginTop: 60, fontSize: 15, fontWeight: '500' }}>
                            No Collection Products Found
                        </Text>
						
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
						
                    </View>
                );
            } else {
                return (
				
				<View style={styles.container}>
				
					<View style={{flexDirection: 'row',flex:1, marginBottom:50}}>
                    <Gallery 
                    initialNumToRender={2}					
                    data={this.state.stpimages}/>
					</View>
					
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
						
                    </View>
                );
            }
        }
    }
}
let styles2 = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});
