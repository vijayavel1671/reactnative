import React, { Component } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Image,
	Text,
	FlatList,
	ScrollView,
	Dimensions,
	AsyncStorage
} from "react-native";
import { SpinkitLarge,TabBarIcon } from "@components";
import { Languages, Style, Config,gAnalytics,Images } from "@common";
import styles from "../../../styles";
import { inject, observer } from "mobx-react";
const APP_WIDTH = Dimensions.get('window').width;
slider_height = ((APP_WIDTH * 362) / 640);

@inject("stores")
@observer
export default class OfferDetailScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			loading: false,
			notfound: false,
			offerid: 0,
			isFetching : false,
			store : null,
			hideHome : false,
		};	 
		gAnalytics.trackScreenView('OfferDetailPage')
	}

  static navigationOptions = {
    title: "Offer",
    headerMode: "screen"
  };

	componentWillMount() {
		let offerid = this.props.navigation.state.params.offerid;
		this.setState({ offerid }, () => {
			this.fetchOfferDetailData(offerid);
		});
	}

	fetchOfferDetailData(id) {
		this.props.stores.partner.getOfferDetails(id).then(result => {
			if (result.status == "success") {
				this.setState({
					data: result.offer,
					store : result.store,
					loading: false
				}, () => {
					this.handleAnalytics();	
				});
			} else {
				this.setState({
					loading: false,
					notfound: true
				}, () => {
					this.handleAnalytics();	
				});
			}
		});

	}

	handleAnalytics(){
      AsyncStorage.getItem("usertoken")
	      .then(item => {
	        if(item){
	          this.props.stores.user.getuserInfoBasic()
	            .then(data => {
	                let d = JSON.parse(data)
	                gAnalytics.setUser(d.id.toString());
	            }).catch(err => console.log(err))
	       	 }
	          gAnalytics.trackEvent('offerdetails','view',
	          	{name : 'OfferDetailPage',offerId : this.state.offerid,
	          		storeId : this.state.store ? this.state.store.id : 'none'});
	      }).catch(e => console.log(e))
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
		if (this.state.loading) {
			return <SpinkitLarge />;
		} else {
			if (this.state.notfound) {
				return (
					<View style={styles.container}>
						<Text style={{ textAlign: "center", marginTop: 60 }}>
							{'Offer not found'}
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
				<View style={[styles.Container]}>	
						<ScrollView style={{ height: '100%' }} onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
							onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}>
                   <View>
                        <View style={{opacity: 1}}>
                            <Image
                               style={{
																		flex: 1, width: '100%', height: slider_height,
                               }}
                               source={{ uri: this.state.data.offer_mobile_image ? Config.BaseUrl + this.state.data.offer_mobile_image : Config.NoImageUrl }}/>

                        </View>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap',  alignItems: 'center', width: '100%' }}>
                            <Text 
                            style={{fontSize: 18,  "fontWeight": "600", color:'#000', paddingLeft: 15, marginTop: 15, marginBottom: 15 }} >
                            {this.state.data.offer_name}{" "} {this.state.store ? ( "(" + this.state.store.store_name + ")") : null}</Text>
                        </View>
                        <View  style={{flexDirection: 'row', flexWrap: 'wrap',  alignItems: 'center', width: '100%' }}>
                        		<Text style={{fontSize: 12,  "fontWeight": "400", color:'#000', paddingLeft: 15, marginTop: 15, marginBottom: 15 }} >
                        			{this.state.data.offer_description}
                        		</Text>
                        </View>
                        {
                        	this.state.data.offer_link ? (<View  style={{ padding: 20}}>
                                <Text>{this.state.data.offer_link}</Text>
                        </View>) : null 
                        }

						{this.state.store ? (
				              <TouchableOpacity
				                style={{
				                  width: "96%",
				                  backgroundColor: "#E29A0D",
				                  borderRadius: 3,
				                  padding: 8,
				                  paddingLeft: 10,
				                  marginLeft: "2%",
				                  marginBottom: 15
				                }}
				                onPress={() =>
				                  this.props.navigation.navigate("Product", {
				                    id: this.state.store.id
				                  })}>
				                <Text
				                  style={[
				                    {
				                      color: "#fff",
				                      marginBottom: 0,
				                      textAlign: "center"
				                    }
				                  ]}>
				                  Visit Showcase 
				                </Text>
				              </TouchableOpacity>
				            ) : null} 
                        
								</View>
						</ScrollView>
										{/*
												!this.state.hideHome ?
													<View style={[Style.fixedFooter, {
														width: 50, height: 50, borderRadius: 100,
														right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end'
													}]}>
														<TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.navigate('Main')}>
															<TabBarIcon icon={Images.icons.news} tintColor={'#fff'} />
														</TouchableOpacity>
													</View> : null
											*/}
						
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