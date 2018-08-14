import React, { Component } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Image,
	Text,
	FlatList,
	AsyncStorage,
	Dimensions
} from "react-native";
import { SpinkitLarge,TabBarIcon } from "@components";
import { Languages, Style, Config,gAnalytics,Images } from "@common";
import styles from "../../../styles";
import { inject, observer } from "mobx-react";

const APP_WIDTH = Dimensions.get('window').width;
slider_height = ((APP_WIDTH * 362) / 640);

@inject("stores")
@observer
export default class StoreOffersEventsScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			loading: true,
			notfound: false,
			storeid: 0,
			isFetching : false,
			hideHome :false,
		};

	gAnalytics.trackScreenView('StoreOffersEventsPage')

	}

  static navigationOptions = {
    title: "Offers & Events",
    headerMode: "screen"
  };

	componentWillMount() {
		let storeid = this.props.navigation.state.params.storeid;
		this.setState({ storeid }, () => {
			this.handleAnalytics();
			this.fetchOffersData(storeid);
		});
	}

	fetchOffersData(id) {
		this.props.stores.partner.getOE(id).then(result => {
			if (result.status == "success") {
				this.setState({
					data: result.offers_and_events,
					loading: false
				});
			}else{
				this.setState({
					loading: false,
					notfound: true
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
	          gAnalytics.trackEvent('storeofferevents','view',
	          	{name : 'StoreOffersEventsPage',storeId : this.state.storeid});
	      }).catch(e => console.log(e))
	}

	onRefresh(id){
    const { stores } = this.props;
    this.setState({ isFetching: true }, () => {
      	this.fetchOffersData(id);
    });
    this.setState({ isFetching: false });
  }

	_renderItem = ({ item }) => {
		return (
			<TouchableOpacity
				key={item.id}
				activeOpacity={0.9}
				style={[
					styles.product_listing_content,
					{   paddingTop: 0,
						borderRadius: 10,
						marginTop: 10,
						marginBottom: 5,
						borderColor: "rgba(193, 193, 193, 0.89)",
						borderWidth: 0.8
					}
				]}
				onPress={() => item.type == 'offer' ?
					 this.props.navigation.navigate("OfferDetail",{offerid : item.id})
					 : this.props.navigation.navigate('WhoWhatWearDetail',{articleid : item.id,atype : 'event'})}>
				<View
					style={[
						styles.product_listing_content_middle,
						{ borderRadius: 10, overflow: "hidden" }
					]}>
					<Image
						style={[
							styles.offers_product_listing_content_img,
							{ borderRadius: 10, overflow: "hidden" }
						]}
						source={{
							uri: item.thumbnail
								? Config.BaseUrl + item.thumbnail
								: Config.NoImageUrl
						}}
					/>
				</View>
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
							{item.name}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

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
							{'Offers & Events not found'}
						</Text>
						{/*
							!this.state.hideHome ?
								<View style={[Style.fixedFooter, {
									width: 50, height: 50, borderRadius: 100,
									right: '4%', bottom: '3%', flex: 1, flexDirection: 'row', justifyContent: 'flex-end'
								}]}>
									<TouchableOpacity style={Style.iconFixFooter} onPress={() => this.props.navigation.goBack()}>
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
			} else {
				return (
				<View style={[styles.Container]}>	
					<FlatList
						onRefresh={() => this.onRefresh(this.state.storeid)}
          				refreshing={this.state.isFetching}
						data={this.state.data}
						keyExtractor={item => item.id}
						renderItem={this._renderItem}
							onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
							onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}
					/>
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