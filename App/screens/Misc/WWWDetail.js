import React, { Component } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Image,
	Text,
	FlatList,
	ScrollView,
	AsyncStorage,
	Dimensions,
	Linking
} from "react-native";
import { SpinkitLarge,TabBarIcon } from "@components";
import { Languages, Style, Config, gAnalytics,Images } from "@common";
import styles from "../../../styles";
import { inject, observer } from "mobx-react";
import HTMLView from "react-native-htmlview";
import moment from 'moment';

const APP_WIDTH = Dimensions.get('window').width;
slider_height = ((APP_WIDTH * 362) / 640);

@inject("stores")
@observer
export default class WWWDetailScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			loading: true,
			notfound: false,
			articleid: 0,
			type: null,
			isFetching: false
		};
		gAnalytics.trackScreenView('WhoWhatWearDetailPage')
	}
	static navigationOptions = ({ navigation }) => {
		const { navigate } = navigation;
		const { params = {} } = navigation.state;
		return {
			title: params.atype,
		}
	}


	componentWillMount() {
		let articleid = this.props.navigation.state.params.articleid;
		let type = this.props.navigation.state.params.atype;
		this.setState({ articleid: articleid, type: type }, () => {
			this.fetchOfferDetailData(articleid);
		});
	}

	fetchOfferDetailData(id) {
		this.props.stores.misc.getArticleById(id).then(result => {
			if (result.status == "success") {
				this.setState({
					data: result.article,
					loading: false
				}, () => {
					this.handleAnalytics();
				});
			} else {
				this.setState({
					notfound: true,
					loading: false,
				}, () => {
					this.handleAnalytics();
				});
			}
		});
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
				gAnalytics.trackEvent('whowhatwear', 'view',
					{
						name: 'WhoWhatWearDetailPage', type: this.state.type, referenceId: this.state.articleid,
						storeId: this.state.data.store_id ? this.state.data.store_id : 'none'
					});
			}).catch(e => console.log(e))
	}

	renderNode(node, index, siblings, parent, defaultRenderer) {
		if (node.name == 'img') {
			const a = node.attribs;
			return (<Image style={{ width: 300, height: 250 }} source={{ uri: a.src }} />);
		}
	}

	handleLink(link) {
		Linking.canOpenURL(link)
			.then(supported => {
				if (!supported) {
					console.error("Can't handle url: " + link);
				} else {
					Linking.openURL(link)
						.then(data => {
							gAnalytics.trackEvent('article', 'open', { url: link });
						})
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
		if (this.state.loading) {
			return <SpinkitLarge />;
		} else {
			if (this.state.notfound) {
				return (
					<View style={styles.container}>
						<Text style={{ textAlign: "center", marginTop: 60 }}>
							{'Article not found'}
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
						<ScrollView onMomentumScrollBegin={() => { this.setState({ hideHome: true }) }}
							onMomentumScrollEnd={() => { this.setState({ hideHome: false }) }}>
						<View>
							<View style={{ opacity: 1 }}>
								<Image
									style={{
										flex: 1, width: '100%', height: slider_height,
									}}
									source={{ uri: this.state.data.mobile_image ? Config.BaseUrl + this.state.data.mobile_image : Config.NoImageUrl }} />

							</View>
							<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
								<Text
									style={{ fontSize: 18, "fontWeight": "600", color: '#000', paddingLeft: 15, marginTop: 15, marginBottom: 15 }} >
									{this.state.data.title}</Text>
							</View>
							{this.state.data.category == 'event' ? (
								<View style={{ padding: 20 }}>
									<Text>{'Event Name : '}{this.state.data.event_name}</Text>
									{this.state.data.start_date ?
										<Text>{'Start Date :'}
											{moment(this.state.data.start_date).format("DD-MM-YYYY")}
										</Text> : null }
									{this.state.data.end_date ?
										<Text>{'End Date :'}
											{moment(this.state.data.end_date).format("DD-MM-YYYY")}
										</Text> : null}
									{this.state.data.start_time ?
										<Text>{'From : '}{this.state.data.start_time}{' to '}{this.state.data.end_time}</Text>
									 : null }
									{this.state.data.location ?
										<Text>{'Location : '}{this.state.data.location}</Text>
									 : null }											
								</View>)
								: null
							}
							<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', width: '100%', padding: 6 }}>
								<HTMLView
									value={this.state.data.body}
									renderNode={this.renderNode} />
							</View>
							{
								this.state.data.url ?
									(
										<TouchableOpacity
											style={{
												width: "96%",
												backgroundColor: "#E29A0D",
												borderRadius: 3,
												padding: 8,
												paddingLeft: 10,
												marginBottom: 15,
												alignSelf: 'center',
												justifyContent: 'center',
												alignContent: 'center',
											}}
											onPress={() => this.handleLink(this.state.data.url)}>
											<Text
												style={[
													{
														color: "#fff",
														marginBottom: 0,
														textAlign: "center"
													}
												]}>
												{'View More'}
											</Text>
										</TouchableOpacity>
									) : null
							}
							{this.state.data.store_id ? (
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
											id: this.state.data.store_id
										})}>
									<Text
										style={[
											{
												color: "#fff",
												marginBottom: 0,
												textAlign: "center"
											}
										]}>
										{'Visit Showcase'}
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